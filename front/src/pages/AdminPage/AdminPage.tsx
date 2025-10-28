import { DFConfirmDialog, DFModal, DFModalContent, DFModalFooter, DFModalHeader, DFTable } from "@df/ui";
import { DEFAULT_INITIAL, useAdminPanel } from "../../hooks/AdminPage/useAdminPanel";
import { User } from "./AdminPage.types";
import { UserForm } from "./UserForm";
import { Button } from "@airbus/components-react";
import { useTranslation } from "react-i18next";
import './admin.css'

function AdminPage() {
  const { t } = useTranslation('admin_panel');

  const {
    query,
    setQuery,
    rows,
    rowCount,
    loading,
    openCreate,
    handleCreate,
    closeCreateModal,
    openEdit,
    handleEdit,
    closeEditModal,
    openDelete,
    handleDelete,
    closeDeleteModal,
    selected,
    submitting,
    editInitial,
    columns,
    submitCreate,
    submitEdit,
    confirmDelete,
    canCreate,
    refresh: fetchUsers,
  } = useAdminPanel();

  const upsertOpen = openCreate || openEdit;
  const isEditMode = !!openEdit
  const closeUpsert = isEditMode ? closeEditModal : closeCreateModal;

  return (
    <div className="adminContainer">
      <DFTable<User>
        title={t("management")}
        columns={columns}
        data={rows}
        loading={loading}
        rowCount={rowCount}
        query={query}
        onQueryChange={setQuery}
        onCreate={canCreate ? handleCreate : undefined}
        onEditRow={canCreate ? handleEdit : undefined}
        onDeleteRow={canCreate ? handleDelete : undefined}
        getRowId={(r) => r.id}
        actionsPosition="last"
        createLabel={t("createUser")}
        editLabel={t("edit")}
        deleteLabel={t("delete")}
      />

      <DFModal open={upsertOpen} onClose={closeUpsert} size="m">
        <DFModalHeader title={isEditMode ? t("editUser") : t("createUser")} onClose={closeUpsert} />
        <DFModalContent>
          <UserForm
            key={isEditMode ? (selected?.id ?? 'edit') : 'create'}
            mode={isEditMode ? 'edit' : 'create'}
            initial={isEditMode ? (editInitial ?? DEFAULT_INITIAL) : DEFAULT_INITIAL}
            submitting={submitting}
            onSubmit={isEditMode ? submitEdit : submitCreate}
          
          />
        </DFModalContent>
        <DFModalFooter>
          <Button variant="primary" onClick={closeUpsert} disabled={submitting}>
            Cancel
          </Button>
        </DFModalFooter>
      </DFModal>

      <DFConfirmDialog
        open={openDelete}
        onClose={closeDeleteModal}
        title={t('deleteUser')}
        message={`${t('user')} ${selected?.username ?? ''} ${t('changeStatus')}`}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        confirming={submitting}
        onConfirm={() => selected ? confirmDelete(selected?.id) : Promise.resolve()}
      />
    </div>
  );
}

export default AdminPage;