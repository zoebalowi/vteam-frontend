// Helper function to get headers with token
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-access-token": localStorage.getItem("token") || ""
});

// Hämta betalningshistorik för en användare
export async function fetchPaymentHistory(userId) {
  try {
    const response = await fetch(`/v1/payment/user/${userId}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.user || [];
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return [];
  }
}

// Alias för bakåtkompatibilitet
export const fetchUserPayments = fetchPaymentHistory;

// Hämta alla betalningar (admin)
export async function fetchAllPayments() {
  try {
    const response = await fetch("/v1/payment", {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.payments || [];
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return [];
  }
}

// Ladda saldo till användarkonto
export async function addBalance(userId, amount, paymentMethod = "card") {
  try {
    const response = await fetch(`/v1/users/loadbalance/${amount}`, {
      method: "POST",
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to add balance:", error);
    throw error;
  }
}

// Skapa betalning för hyra
export async function createPayment(paymentData) {
  try {
    const response = await fetch("/v1/payment/new", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to create payment:", error);
    throw error;
  }
}
