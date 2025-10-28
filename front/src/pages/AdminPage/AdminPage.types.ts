

import { QueryState } from "@df/ui/dist/types/tables/DFTable/DFTable.types";
import { MRT_ColumnDef } from "material-react-table";

export type User = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    group_names: string[];
    is_active: boolean;
}

export type UserDetail = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    groups: { id: number, name: string }[];
}

export type UserFormValues = {
    username: string;
    first_name: string;
    last_name: string;
    email?: string;
    groups: number[];
    is_active: boolean;
}

export type UserFormProps = {
    initial?: Partial<UserFormValues>;
    mode?: 'create' | 'edit';
    submitting?: boolean;
    onSubmit: (v: UserFormValues) => Promise<void> | void;
}

export type GroupOption = {
    label: string;
    value: string;
}

export type UpsertState = {
    open: boolean;
    mode: 'create' | 'edit'
}

export interface AdminPanelAPI {
    columns: MRT_ColumnDef<User>[];
    rows: User[];
    rowCount: number;
    loading: boolean;
    submitting: boolean;
    query: QueryState;
    setQuery: React.Dispatch<React.SetStateAction<QueryState>>;
    openCreate: boolean;
    openEdit: boolean;
    openDelete: boolean;
    selected: User | null;
    editInitial: Partial<UserFormValues> | null;
    handleCreate: () => void;
    closeCreateModal: () => void;
    handleEdit: (row: User) => Promise<void>;
    closeEditModal: () => void;
    handleDelete: (row: User) => void;
    closeDeleteModal: () => void;
    submitCreate: (v: UserFormValues) => Promise<void>;
    submitEdit: (v: UserFormValues) => Promise<void>;
    confirmDelete: (userId: string) => Promise<void>;
    canCreate: boolean;
    groupOptions: ReadonlyArray<{ label: string, value: string | number }>;
    isEditMode: boolean;
    refresh: () => Promise<void>
}

