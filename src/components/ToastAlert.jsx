import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearRegistrationFeedback } from '../features/registrations/registrationsSlice';
import { clearAuthMessages } from '../features/auth/authSlice';

function ToastAlert() {
  const dispatch = useDispatch();
  const regFeedback = useSelector((state) => state.registrations.feedback);
  const authSuccess = useSelector((state) => state.auth.authSuccess);

  const activeMessage = regFeedback
    ? regFeedback
    : authSuccess
    ? { type: 'success', text: authSuccess }
    : null;

  useEffect(() => {
    if (!regFeedback && !authSuccess) return undefined;

    const timer = setTimeout(() => {
      if (regFeedback) dispatch(clearRegistrationFeedback());
      if (authSuccess) dispatch(clearAuthMessages());
    }, 4000);

    return () => clearTimeout(timer);
  }, [regFeedback, authSuccess, dispatch]);

  if (!activeMessage) {
    return null;
  }

  const handleDismiss = () => {
    if (regFeedback) dispatch(clearRegistrationFeedback());
    if (authSuccess) dispatch(clearAuthMessages());
  };

  return (
    <div className={`toast-banner toast-${activeMessage.type || 'info'}`} role="status">
      <span className="toast-text">{activeMessage.text}</span>
      <button
        type="button"
        className="toast-close"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default ToastAlert;

