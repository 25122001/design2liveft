import React, { useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";
import Swal from "sweetalert2";

import StatsCard from "./Components/StatusCard";
import SearchBar from "./Components/SearchBar";
import UserTable from "./Components/UserTable";
import UserModel from "./Components/UserModel";
import Login from "./Login";

import {
  getUsers,
  searchUsers,
  getStats,
  addUser,
  updateUser,
  deleteUser,
} from "./api/userApi";

function App() {
  /* ================= AUTH STATE ================= */

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ================= USERS STATE ================= */

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    working: "",
    portion: "",
    status: "active",
  });

  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [showSensitive, setShowSensitive] = useState(false);

  /* ================= AUTO TOKEN CHECK ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  /* ================= MASK FUNCTIONS ================= */

  const maskAadhar = (aadhar) => {
    if (!aadhar) return "";
    return "XXXX XXXX " + aadhar.slice(-4);
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.slice(0, 2) + "XXXXXX" + phone.slice(-2);
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "****@" + domain;
  };

  const displayedUsers = users.map((user) => ({
    ...user,
    phone: showSensitive ? user.phone : maskPhone(user.phone),
    email: showSensitive ? user.email : maskEmail(user.email),
    aadhar: showSensitive ? user.aadhar : maskAadhar(user.aadhar),
  }));

  /* ================= EMAIL VALIDATION ================= */

  const validateEmail = (email) => {
    if (!email || !email.trim()) return "Email is required";

    const cleanedEmail = email.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(cleanedEmail)) {
      return "Please enter a valid email address (example: name@gmail.com)";
    }

    return "";
  };

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, itemsPerPage]);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats({
        total: data?.total || 0,
        active: data?.active || 0,
        inactive: data?.inactive || 0,
      });
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers(currentPage, itemsPerPage);

      setUsers(data?.users || []);
      setTotalUsers(data?.totalUsers || 0);
      setTotalPages(data?.totalPages || 0);

      await fetchStats();
    } catch (error) {
      console.error("Fetch users error:", error);

      if (error?.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const data = await searchUsers(searchTerm, currentPage, itemsPerPage);

      setUsers(data?.users || []);
      setTotalUsers(data?.totalUsers || 0);
      setTotalPages(data?.totalPages || 0);

      await fetchStats();
    } catch (error) {
      console.error("Search error:", error);

      if (error?.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {
    const { name, email, phone, aadhar, working, portion } = formData;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !aadhar?.trim() ||
      !working?.trim() ||
      !portion?.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
      });
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: emailError,
      });
      return;
    }

    if (!/^\d{12}$/.test(aadhar)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Aadhar",
        text: "Aadhar must be 12 digits",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingItem && editingItem._id) {
        await updateUser(editingItem._id, formData);

        await Swal.fire({
          icon: "success",
          title: "Tenant Updated",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await addUser(formData);

        await Swal.fire({
          icon: "success",
          title: "Tenant Added",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      await fetchUsers();
      closeModel();
    } catch (error) {
      console.error("Submit error:", error);

      if (error?.response?.status === 401) {
        handleLogout();
      }

      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text: "Duplicate or error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this tenant deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await deleteUser(id);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);

      if (error?.response?.status === 401) {
        handleLogout();
      }

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
      });
    }
  };

  /* ================= MODAL CONTROL ================= */

  const openModel = (item = null) => {
    if (item) {
      setEditingItem(item); // ✅ SET EDIT ITEM
      setFormData({ ...item }); // ✅ FILL FORM
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        aadhar: "",
        working: "",
        portion: "",
        status: "active",
      });
    }
    setIsModalOpen(true);
  };

  const closeModel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  /* ================= AUTH GUARD ================= */

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-950">
      {/* HEADER */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Users size={24} className="text-white" />
            <h1 className="text-xl sm:text-2xl text-white font-bold">
              Tenant List
            </h1>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="bg-yellow-400 px-3 py-2 text-sm sm:text-base rounded w-full sm:w-auto"
            >
              {showSensitive ? "Hide" : "Show"}
            </button>

            <button
              onClick={() => openModel()}
              className="bg-green-500 px-3 py-2 text-sm sm:text-base rounded flex items-center justify-center gap-1 w-full sm:w-auto"
            >
              <Plus size={16} /> Add
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-2 text-sm sm:text-base rounded text-white w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-4 sm:p-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={<Users size={22} />}
            color="bg-purple-500"
          />

          <StatsCard
            title="Active Users"
            value={stats.active}
            icon={<Users size={22} />}
            color="bg-yellow-500"
          />

          <StatsCard
            title="Inactive Users"
            value={stats.inactive}
            icon={<Users size={22} />}
            color="bg-orange-500"
          />
        </div>

        {/* SEARCH */}
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1); // ✅ reset page on search
          }}
          onClear={() => {
            setSearchTerm("");
            setCurrentPage(1);
          }}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          totalUsers={totalUsers}
        />

        {/* TABLE */}
        <div className="mt-4 overflow-x-auto">
          <UserTable
            users={displayedUsers}
            onEdit={openModel}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* MODAL */}
        <UserModel
          isOpen={isModalOpen}
          onClose={closeModel}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          editingItem={editingItem}
        />
      </main>
    </div>
  );
}

export default App;
