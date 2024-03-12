import axios from "axios";
import { BASE_URL } from "@env";

const baseURL = "http://10.106.29.2:8000";

const authApi = axios.create({
  baseURL,
  withCredentials: true,
});

export const login = async (phoneNumber, password) => {
  try {
    const response = await authApi.post("/login", { phoneNumber, password });

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || "An error occurred during login.";
  }
};

export const signup = async (formData) => {
  try {
    const response = await authApi.post("/signup", formData);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Signup error:", error);
    throw (
      error.response?.data || "An error occurred during staff registration."
    );
  }
};

export const logout = async () => {
  try {
    const response = await authApi.delete("/logout");

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data || "An error occurred during logout.";
  }
};

export const getProfile = async () => {
  try {
    const response = await authApi.get("/profile");

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Get profile error:", error);
    throw (
      error.response?.data || "An error occurred while fetching the profile."
    );
  }
};

export const editProfile = async (formData) => {
  try {
    const response = await authApi.put("staff/edit", formData);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Edit Profile error:", error);
    throw error.response?.data || "An error occurred during profile update.";
  }
};

export const checkExistingRecord = async (field, value) => {
  try {
    const response = await authApi.get(
      `/checkexistingrecord/${field}/${value}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Check Existing Record Error:", error);
    throw error.response?.data || "An error occurred during uniqueness check.";
  }
};

export const submitPatientEntry = async (data) => {
  try {
    const response = await authApi.post("/patiententry", data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Patient Entry error:", error);
    throw error.response?.data || "An error occurred during patient entry.";
  }
};

export const getAllPatientDetails = async () => {
  try {
    const response = await authApi.get("/patientdetails");
    return response.data;
  } catch (error) {
    console.error("Get all patient details error:", error);
    throw (
      error.response?.data ||
      "An error occurred while fetching all patient details."
    );
  }
};

export const getPatientDetailsById = async (patientId) => {
  try {
    const response = await authApi.get(`/patientdetails/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Get patient details by ID error:", error);
    throw (
      error.response?.data ||
      "An error occurred while fetching patient details by ID."
    );
  }
};

export const updatePatientDetailsById = async (patientId, data) => {
  try {
    const response = await authApi.put(`/patientdetails/${patientId}`, data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Update Patient Details error:", error);
    throw (
      error.response?.data || "An error occurred during patient details update."
    );
  }
};

export const deletePatientById = async (patientId) => {
  try {
    const response = await authApi.delete(`/patientdetails/${patientId}`);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Delete patient error:", error);
    throw error.response?.data || "An error occurred during patient deletion.";
  }
};

export const submitRevisit = async (data) => {
  try {
    const response = await authApi.post("/revisits", data);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Revisit Entry error:", error);
    throw error.response?.data || "An error occurred during revisit entry.";
  }
};
export const getRevisitData = async (phoneNumber) => {
  try {
    const response = await authApi.get(`/revisits/${phoneNumber}`);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Get Revisit Data error:", error);
    throw (
      error.response?.data || "An error occurred while fetching revisit data."
    );
  }
};

export default authApi;
