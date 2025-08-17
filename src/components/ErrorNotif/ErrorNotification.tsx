import React from 'react';
import classNames from 'classnames';

interface ErrorNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !isVisible },
      )}
    >
      {message && (
        <>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={onClose}
          />
          {message}
        </>
      )}
    </div>
  );
};
