import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

// ── State shape ───────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true until we verify stored token on mount
  error: null,
};

// ── Actions ───────────────────────────────────────────────────────────────────
const AUTH_ACTIONS = {
  AUTH_START:   'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT:       'LOGOUT',
  CLEAR_ERROR:  'CLEAR_ERROR',
};

// ── Reducer ───────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return { ...state, isLoading: true, error: null };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * On mount: check localStorage for existing token.
   * If found, verify it with the server before trusting it.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
        return;
      }

      try {
        const { data } = await authService.getMe();
        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: { user: data.user, token },
        });
      } catch {
        // Token is invalid or expired — clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: null });
      }
    };

    initializeAuth();
  }, []);

  // ── Auth actions ────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const { data } = await authService.register(formData);
      localStorage.setItem('authToken', data.token);
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: message });
      return { success: false, message, errors: error.response?.data?.errors };
    }
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem('authToken', data.token);
      dispatch({ type: AUTH_ACTIONS.AUTH_SUCCESS, payload: data });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    register,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
