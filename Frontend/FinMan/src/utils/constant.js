export const API_BASE_URL = 'https://finman-backend-5src.onrender.com//api/transactions';
export const BUDGET_API_BASE = 'https://finman-backend-5src.onrender.com//api/budgets'; 

export const CREATE_TRANSACTION = `${API_BASE_URL}/create`;
export const GET_TRANSACTION=`${API_BASE_URL}/get`;
export const DELETE_TRANSACTION=`${API_BASE_URL}/delete`;

//Budgets

export const GET_BUDGET=`${BUDGET_API_BASE}/getBudgets`;
export const SET_BUDGET=`${BUDGET_API_BASE}/setBudget`;
export const DELETE_BUDGET=`${BUDGET_API_BASE}/deleteBudget`;