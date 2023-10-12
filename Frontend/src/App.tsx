/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input as AntInput, Button, Modal, Input, Table } from "antd";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import axios from "axios";

import CustomTabel from "./Components/CustomTabel";
import CreateModal from "./Components/CreateModal";
import UpdateModal from "./Components/Update Modal";

type Data = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

function fetchUsers() {
  return fetch("http://localhost:3000/user").then((res) => res.json());
}

async function createUser(data: Data) {
  try {
    const response = await axios.post("http://localhost:3000/user", data);
    const newuser: Data = response.data;
    return newuser;
  } catch (error) {
    throw error;
  }
}
async function updateUser(userId: string, updatedData: Data) {
  try {
    const serializedData = JSON.stringify(updatedData);

    const response = await axios.patch(
      `http://localhost:3000/user/${userId}`,
      serializedData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const updatedUser = response.data;
    return updatedUser;
  } catch (error) {
    throw error;
  }
}
async function deleteUser(userId: string) {
  try {
    await axios.delete(`http://localhost:3000/user/${userId}`);
  } catch (error) {
    throw error;
  }
}

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<Data | null>(null);

  const searchFilter = (value: any, record: { name: string | string[] }) => {
    if (typeof value === "string") {
      return String(record.name).toLowerCase().includes(value.toLowerCase());
    }
    return false;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      filteredValue: [searchedText],
      onFilter: searchFilter, // Use the search function
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "password",
      dataIndex: "password",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: string, record: Data) => (
        <div className="flex gap-3">
          <Button
            icon={<MdEditSquare size={24} className="text-blue-500" />}
            onClick={() => handleEdit(record)}
            className="p-0 border-none"
          />
          <Button
            icon={<MdDelete size={24} className="text-red-500" />}
            onClick={() => handleDelete(record.id)}
            className="p-0 border-none"
          />
        </div>
      ),
    },
  ];

  const queryClient = useQueryClient();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery("users", fetchUsers);
  const DataSource = result || [];

  const mutation = useMutation(
    (data: Data) => createUser(data), // Your createUser function
    {
      onMutate: (newUserData) => {
        // Use optimistic updates to add the new user to the local data
        queryClient.setQueryData("users", (prevData: any) => {
          if (Array.isArray(prevData)) {
            // Check if prevData is an array
            return [...prevData, newUserData];
          }
          return [newUserData];
        });

        return newUserData; // Return the newUserData as the context
      },
      onError: (error) => {
        // Handle error
        console.error("Mutation error:", error);
      },
      onSettled: (data, error) => {
        // Handle after mutation is settled
        if (error) {
          // Handle error
          console.error("Mutation error:", error);
        } else {
          // Mutation succeeded
          console.log("Mutation succeeded. Data:", data);
        }
      },
      // Other mutation options...
    }
  );
  const Editmutation = useMutation(
    (updatedData: Data) => updateUser(editingUser.id, updatedData), // The update function

    {
      onMutate: (updatedData) => {
        console.log(updatedData);
        // Use optimistic updates to update the local data immediately
        queryClient.setQueryData("users", (prevData: any) => {
          if (Array.isArray(prevData)) {
            // Find the index of the user being updated
            const index = prevData.findIndex(
              (user) => user.id === editingUser.id
            );
            if (index !== -1) {
              // Create a copy of the previous data
              const updatedData = [...prevData];
              // Update the user's data in the local array
              updatedData[index] = { ...editingUser, ...updatedData };
              return updatedData;
            }
          }
          return prevData;
        });

        // Return the updatedData to be used as context
        return updatedData;
      },
      onError: (error) => {
        // Handle any errors that occur during the update
        console.error("Update error:", error);
      },
      onSettled: (data, error) => {
        // Handle after the mutation is settled
        if (!error) {
          // The mutation succeeded, you can perform any additional actions here
          console.log("Mutation succeeded. Updated data:", data);
        }
      },
    }
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = data;

    // Call the mutation with the modified userData
    mutation.mutate(userData);

    setIsModalVisible(false); // Close the modal after creating the user
  };

  // useEffect(() => {
  //   fetch("https://dummyjson.com/users")
  //     .then((res) => res.json())
  //     .then((result) => {
  //       // Add a unique key to each data item
  //       const dataWithKeys = result.users.map((item: Data, index: number) => ({
  //         ...item,
  //         key: index.toString(),
  //       }));
  //       setDataSource(dataWithKeys);
  //     });
  // }, []);

  const handleEdit = (user: Data) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
  };

  const handleUpdate = async (data: any) => {
    try {
      // Call the mutation to update the user's data
      const { id, confirmPassword, ...userdata } = data;
      await Editmutation.mutateAsync(userdata);

      // Close the modal after a successful update
      handleEditCancel();
    } catch (error) {
      // Handle any errors that occur during the update
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // Call the delete mutation to delete the user
      await deleteUser(userId);

      // After successful deletion, refetch the data to update the table
      await queryClient.invalidateQueries("users");
    } catch (error) {
      // Handle any errors that occur during deletion
      console.error("Delete error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const buttonStyle = {
    background: "#1752bf",
    color: "white",
  } as React.CSSProperties;
  return (
    <div className=" py-5 px-16">
      <h1 className=" text-4xl flex items-center justify-center text-blue-500">
        Users
      </h1>

      <div className=" flex  items-center justify-between mb-3">
        <Input.Search
          placeholder="Search Users ...."
          style={{ width: 300 }}
          onSearch={(value: string) => {
            setSearchedText(value);
          }}
        />
        <div className="">
          <Button size="large" style={buttonStyle} onClick={showModal}>
            Create User
          </Button>
        </div>
      </div>
      <CustomTabel columns={columns} dataSource={DataSource} />
      
      <CreateModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        control={control}
        onSubmit={onSubmit}
        errors={errors}
      />
       <UpdateModal
        isEditModalVisible={isEditModalVisible}
        handleEditCancel={handleEditCancel}
        handleSubmit={handleSubmit}
        control={control}
        editingUser={editingUser}
        onSubmit={handleUpdate}
        errors={errors}
      />
    </div>
  );
}

export default App;
