import axios from "axios";
import { ToastAndroid } from "react-native";
import { BASE_URL } from "@env";

const baseURL = "http://10.106.31.57:8000";

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

    let errorMessage = "An error occurred during patient entry.";

    if (error.response && error.response.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }

    throw errorMessage;
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

    if (error.response) {
      if (error.response.status === 404) {
        throw "Patient not found.";
      } else if (error.response.status === 403) {
        throw "You can only delete patients within 48 hours from the creation time.";
      } else {
        throw (
          error.response.data || "An error occurred during patient deletion."
        );
      }
    } else {
      throw "An error occurred while deleting the patient.";
    }
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

    if (error.response && error.response.data) {
      throw (
        error.response.data.message || "An error occurred during revisit entry."
      );
    } else {
      throw "An error occurred while communicating with the server.";
    }
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

export const editRevisitById = async (phoneNumber, revisitId, data) => {
  try {
    const response = await authApi.put(
      `/revisits/${phoneNumber}/${revisitId}`,
      data
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Edit Revisit error:", error);
    if (error.response && error.response.status === 403) {
      throw new Error(
        "You can only edit revisits within 48 hours from the posting time."
      );
    } else {
      throw error.response?.data || "An error occurred during revisit update.";
    }
  }
};

export const deleteRevisitById = async (phoneNumber, revisitId) => {
  try {
    const response = await authApi.delete(
      `/revisits/${phoneNumber}/${revisitId}`
    );

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Delete Revisit error:", error);
    if (error.response && error.response.status === 403) {
      throw new Error("You can only delete revisits within 48 hours.");
    } else if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw "An error occurred during revisit deletion.";
    }
  }
};

export const editStaffProfile = async (phoneNumber, data) => {
  try {
    const response = await authApi.put(`/edit/staff/${phoneNumber}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteStaffProfile = async (phoneNumber) => {
  try {
    const response = await authApi.delete(`/remove/staff/${phoneNumber}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllStaffProfiles = async () => {
  try {
    const response = await authApi.get("/staff/sc/profiles");

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response from the server");
    }
  } catch (error) {
    console.error("Get all staff profiles error:", error);
    throw (
      error.response?.data ||
      "An error occurred while fetching all staff profiles."
    );
  }
};

export const setLocation = async (locationData) => {
  try {
    const response = await authApi.post("/set/location", locationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Failed to set location");
  }
};

export const getLocation = async () => {
  try {
    const response = await authApi.get("/get/location");
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    ToastAndroid.show("Failed to fetch location", ToastAndroid.SHORT);
    throw error;
  }
};

export const deleteLocation = async (locationId) => {
  try {
    const response = await authApi.delete(`/delete/location/${locationId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Location not found");
    } else {
      console.error("Error deleting location:", error);
      throw new Error("Failed to delete location");
    }
  }
};

export const getTargetLocations = async () => {
  try {
    const response = await authApi.get("/target/coordinates");
    return response.data;
  } catch (error) {
    console.error("Error fetching target locations:", error);
    ToastAndroid.show("Failed to fetch target locations", ToastAndroid.SHORT);
    throw error;
  }
};

export const markLoginAttendance = async (
  staffId,
  password,
  latitude,
  longitude
) => {
  try {
    if (typeof staffId !== "string" || !staffId.trim()) {
      throw new Error("Invalid staffId");
    }

    const response = await authApi.post(`/staff/${staffId}/login`, {
      password,
      latitude,
      longitude,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to mark login attendance");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error marking login attendance:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      console.error("Error marking login attendance: No response received");
      throw new Error("No response received from server");
    } else {
      console.error("Error marking login attendance:", error.message);
      throw new Error("Request failed: " + error.message);
    }
  }
};

export const markLogoutAttendance = async (staffId, password, workHours) => {
  try {
    if (typeof staffId !== "string" || !staffId.trim()) {
      throw new Error("Invalid staffId");
    }

    const response = await authApi.post(`/staff/${staffId}/logout`, {
      password,
      workHours,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error marking logout attendance:", error.response.data);
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      console.error("Error marking logout attendance: No response received");
      throw new Error("No response received from server");
    } else {
      console.error("Error marking logout attendance:", error.message);
      throw new Error("Request failed: " + error.message);
    }
  }
};

export const GetAttendance = async (staffId) => {
  try {
    const response = await authApi(`/staff/attendance/${staffId}`);
    return response.data.attendance;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw new Error(
      error.response?.data.message ||
        "Failed to fetch attendance. Please try again."
    );
  }
};

export const GetYearlyPatientData = async (year) => {
  try {
    const response = await authApi.get(`/patients/yearly/data/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching yearly patient data:", error);
    if (error.response) {
      const errorMessage =
        error.response.data.message || "Failed to fetch patient data";
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      throw new Error(errorMessage);
    } else if (error.request) {
      ToastAndroid.show("No response from server", ToastAndroid.SHORT);
      throw new Error("No response from server");
    } else {
      ToastAndroid.show("Request failed", ToastAndroid.SHORT);
      throw new Error("Request failed");
    }
  }
};

export const getStaffEntriesById = async (staffId) => {
  try {
    const response = await authApi.get(`/staffEntries/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff entries by ID:", error);
    if (error.response) {
      const errorMessage =
        error.response.data.message || "Failed to fetch staff entries";
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      throw new Error(errorMessage);
    } else if (error.request) {
      ToastAndroid.show("No response from server", ToastAndroid.SHORT);
      throw new Error("No response from server");
    } else {
      ToastAndroid.show("Request failed", ToastAndroid.SHORT);
      throw new Error("Request failed");
    }
  }
};

export default authApi;
