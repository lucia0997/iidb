from typing import Any, Dict, List, Union, Optional

JsonData = Union[Dict[str, Any], List[Any], str, int, float, bool, None]

def _leaf_list(msg: Any) -> List[str]:
    if isinstance(msg, (list, tuple)):
        return [str(m) for m in msg]
    return [str(msg)]

def _normalize_drf_detail(detail: Any) -> Any:
    if isinstance(detail, dict):
        return {k: _normalize_drf_detail(v) for k,v in detail.items()}
    if isinstance(detail, list):
        return [_normalize_drf_detail(v) if isinstance(v, (dict, list)) else _leaf_list(v) for v in detail]
    return _leaf_list(detail)

def _project_errors_onto_payload(
    error: Any,
    payload: Any,
    *,
    dense_arrays: bool,
    non_field_errors_key: str,
) -> Any:
    # Arrays: if dense_arrays = True return a list with len(payload)
    # indices without error filled with None
    if isinstance(payload, list):
        out = [None] * len(payload) if dense_arrays else []
        if isinstance(error, list):
            for i in range(min(len(payload), len(error))):
                if error[i] is None: continue
                if dense_arrays: 
                    out[i] = _project_errors_onto_payload(
                        error[i],
                        payload[i],
                        dense_arrays=dense_arrays,
                        non_field_errors_key=non_field_errors_key
                    ) if isinstance(error[i], (dict, list)) else error[i]
                else:
                    out.append({
                        "_index": i,
                        "errors": _project_errors_onto_payload(
                            error[i],
                            payload[i],
                            dense_arrays=dense_arrays,
                            non_field_errors_key=non_field_errors_key
                            ) if isinstance(error[i], (dict, list)) else error[i]
                    })
        if isinstance(error, dict):
            for k, v in error.items():
                if not k.isnumeric() or not 0 <= int(k) < len(payload): continue
                i = int(k)
                if dense_arrays: 
                    out[i] = _project_errors_onto_payload(
                        v,
                        payload[i],
                        dense_arrays=dense_arrays,
                        non_field_errors_key=non_field_errors_key
                    ) if isinstance(v, (dict, list)) else v
                else:
                    out.append({
                        "_index": i,
                        "errors": _project_errors_onto_payload(
                            v,
                            payload[i],
                            dense_arrays=dense_arrays,
                            non_field_errors_key=non_field_errors_key
                            ) if isinstance(v, (dict, list)) else v
                    })
        return out if dense_arrays else [x for x in out if x is not None]
    
    # Objects
    if isinstance(payload, dict) and isinstance(error, dict):
        out = {}
        for k,v in error.items():
            out[k] = _project_errors_onto_payload(
                    v,
                    payload.get(k),
                    dense_arrays=dense_arrays,
                    non_field_errors_key=non_field_errors_key
                    ) if isinstance(v, (dict, list)) else _leaf_list(v)
        return out
    
    # Scalar payload
    if isinstance(error,(dict,list)):
        return error
    return _leaf_list(error)

def build_field_errors(
        drf_detail: Any,
        *,
        request_payload: Optional[JsonData],
        dense_arrays: bool = True,
        non_field_errors_key = 'errors',
) -> Any:
    """
    Parameters: 
        drf_detail: Raw ValidationError.detail
        request_payload: Original request.payload to allign shapes if validation error
        dense_arrays:   True => array outputs match payload length (with null values)
                        False => includes only the errors in a dictionary:
                                    { _index: num, error: str }
        non_field_errors_key: Field name for the object-level errors.

    Outputs:
        error_response: A JSON serializable structure with the response content. 
                        If validation error, it has the same shape as the payload.

    Functionality:
        Turn DRF's ValidationError.detail errors into a stable field_errors tree renderizable by 
        the UI.
        - Leaves are list[str]
        - Nested structure is preserved
        - Not dense arrays mode
    """

    normalized = _normalize_drf_detail(drf_detail)
    if request_payload is None: return normalized
    return _project_errors_onto_payload(
        normalized,
        request_payload,
        dense_arrays=dense_arrays,
        non_field_errors_key=non_field_errors_key
    )
        

