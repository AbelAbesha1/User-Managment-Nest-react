// UserModal.js
import React from "react";
import { Modal, Button } from "antd";
import { Controller } from "react-hook-form";
import {  Input as AntInput } from "antd";
import PropTypes from "prop-types";

const CreateModal = ({ isModalVisible, handleCancel, handleSubmit, control, onSubmit, errors }) => {
  return (
    <Modal
      title="Create User"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} className="bg-red-500 text-white">
          Cancel
        </Button>,
        <Button key="create" onClick={handleSubmit(onSubmit)} className="bg-blue-500 text-white">
          Create
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <Controller name="name" control={control} defaultValue="" render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.name?.message}</p>
        </div>
        <div>
          <label>Email</label>
          <Controller name="email" control={control} defaultValue="" render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <label>Phone</label>
          <Controller name="phone" control={control} defaultValue="" render={({ field }) => <AntInput {...field} />} />
          <p className="text-red-500">{errors.phone?.message}</p>
        </div>
        <div>
          <label>Password</label>
          <Controller name="password" control={control} defaultValue="" render={({ field }) => <AntInput type="password" {...field} />} />
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

CreateModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default CreateModal;
