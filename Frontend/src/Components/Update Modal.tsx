// UserUpdateModal.js
import React from "react";
import { Modal, Button } from "antd";
import { Controller } from "react-hook-form";
import { Input as AntInput } from "antd";
import PropTypes from "prop-types";



const UpdateModal = ({ isEditModalVisible, handleEditCancel, handleSubmit, control, editingUser, onSubmit, errors }) => {
  return (
    <Modal
      title="Update User"
      visible={isEditModalVisible}
      onCancel={handleEditCancel}
      footer={[
        <Button key="cancel" onClick={handleEditCancel} className="bg-red-500 text-white">
          Cancel
        </Button>,
        <Button key="update" onClick={handleSubmit(onSubmit)} className="bg-blue-500 text-white">
          Update
        </Button>,
      ]}
    >
       <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <Controller name="name" control={control} defaultValue={editingUser ? editingUser.name : ""} render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <Controller name="email" control={control} defaultValue={editingUser ? editingUser.email : ""} render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <label>Phone</label>
          <Controller name="phone" control={control} defaultValue={editingUser ? editingUser.phone : ""} render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.phone?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <Controller name="password" control={control} defaultValue={editingUser ? editingUser.password : ""} render={({ field }) => <AntInput type="password" {...field} />} />
          <p className="text-red-500">{errors.password?.message}</p>
        </div>
        <div>
          <label>Confirm Password</label>
          <Controller name="confirmPassword" control={control} defaultValue="" render={({ field }) => <AntInput type="password" {...field} />} />
          <p className="text-red-500">{errors.confirmPassword?.message}</p>
        </div>
      </form>
    </Modal>
  );
};
UpdateModal.propTypes = {
  isEditModalVisible: PropTypes.bool.isRequired,
  handleEditCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  editingUser: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default UpdateModal;
