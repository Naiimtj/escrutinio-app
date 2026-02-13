import React from 'react';
import BaseSpinner from './BaseSpinner';
import BaseDropdown from './BaseDropdown';
import BaseIcon from './BaseIcon';
import BaseButton from './BaseButton';

const BaseActions = ({
  showView = false,
  showEdit = false,
  showDelete = false,
  showArchive = false,
  showAddToFavorites = false,
  showDuplicate = false,
  showDownload = false,
  showSave = false,
  showClose = false,
  showPrint = false,
  size = 'small',
  loading = false,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onAddToFavorites,
  onDuplicate,
  onDownload,
  onSave,
  onClose,
  onPrint,
}) => {
  const defaultActions = [
    {
      key: 'view',
      name: 'View',
      icon: 'pi-eye',
      color: 'primary',
      action: onView,
      displayNameKey: 'action.view',
    },
    {
      key: 'save',
      name: 'Save',
      icon: 'pi-save',
      color: 'primary',
      action: onSave,
      displayNameKey: 'action.save',
    },
    {
      key: 'close',
      name: 'Close',
      icon: 'pi-times',
      color: 'primary',
      action: onClose,
      displayNameKey: 'action.close',
    },
    {
      key: 'edit',
      name: 'Edit',
      icon: 'pi-pencil',
      color: 'primary',
      action: onEdit,
      displayNameKey: 'action.edit',
    },
    {
      key: 'archive',
      name: 'Archive',
      icon: 'pi-archive',
      color: 'warning',
      action: onArchive,
      displayNameKey: 'action.archive',
    },
    {
      key: 'addToFavorites',
      name: 'Add to Favorite',
      icon: 'pi-heart',
      color: 'primary',
      action: onAddToFavorites,
      displayNameKey: 'action.add-to-favorites',
    },
    {
      key: 'duplicate',
      name: 'Duplicate',
      icon: 'pi-clone',
      color: 'primary',
      action: onDuplicate,
      displayNameKey: 'action.duplicate',
    },
    {
      key: 'download',
      name: 'Download',
      icon: 'pi-download',
      color: 'primary',
      action: onDownload,
      displayNameKey: 'action.download',
    },
    {
      key: 'delete',
      name: 'Delete',
      icon: 'pi-trash',
      color: 'danger',
      action: onDelete,
      displayNameKey: 'action.delete',
    },
    {
      key: 'print',
      name: 'Print',
      icon: 'pi-print',
      color: 'primary',
      action: onPrint,
      displayNameKey: 'action.print-sample-labels',
    },
  ];

  const filterActions = () => {
    return defaultActions.filter((action) => {
      const actionFlags = {
        view: showView,
        save: showSave,
        close: showClose,
        edit: showEdit,
        delete: showDelete,
        archive: showArchive,
        addToFavorites: showAddToFavorites,
        duplicate: showDuplicate,
        download: showDownload,
        print: showPrint,
      };
      return actionFlags[action.key] && action.action;
    });
  };

  const actions = filterActions();

  if (loading) {
    return <BaseSpinner size="sm" />;
  }

  return (
    <>
      {/* Desktop View - Icons */}
      <div className="hidden xl:flex flex-row gap-2">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.action}
            title={action.displayNameKey}
            className="text-gray-600 hover:text-blue-600 transition-colors p-1"
          >
            <BaseIcon icon={action.icon} size={size} />
          </button>
        ))}
      </div>

      {/* Mobile View - Dropdown */}
      <div className="flex xl:hidden">
        <BaseDropdown>
          <button className="text-gray-600 hover:text-blue-600 transition-colors p-1">
            <BaseIcon icon="pi-ellipsis-h" />
          </button>
          <div className="flex flex-col gap-2 p-2">
            {actions.map((action) => (
              <BaseButton
                key={action.key}
                label={action.name}
                text
                onClick={action.action}
              />
            ))}
          </div>
        </BaseDropdown>
      </div>
    </>
  );
};

export default BaseActions;
