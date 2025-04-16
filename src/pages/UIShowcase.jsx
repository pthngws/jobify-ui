import React, { useState } from 'react';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Calendar from '../components/ui/Calendar';
import Card from '../components/ui/Card';
import DynamicInputList from '../components/ui/DynamicInputList';
import FileInput from '../components/ui/FileInput';
import IconLabel from '../components/ui/IconLabel';
import Input from '../components/ui/Input';
import Popover from '../components/ui/Popover';
import ProfileLayout from '../components/ui/ProfileLayout';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { UserIcon } from '@heroicons/react/24/solid';

const UIShowcase = () => {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    dob: '',
    gender: '',
  });
  const [skills, setSkills] = useState(['React', 'JavaScript']);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <ProfileLayout>
      

      <Card className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Profile UI Showcase</h1>
        <div className="mb-8 flex gap-3">
        <Button
          onClick={() => showAlert('This is a success alert!', 'success')}
          variant="primary"
          className="w-auto px-4"
        >
          Show Success Alert
        </Button>
        <Button
          onClick={() => showAlert('This is an error alert!', 'error')}
          variant="danger"
          className="w-auto px-4"
        >
          Show Error Alert
        </Button>
      </div>

      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: 'success' })}
        />
      )}
        {/* Avatar */}
        <div className="flex items-center mb-8">
  <Avatar
    src="https://res.cloudinary.com/dx1irzekz/image/upload/v1744613459/avatars/1744613456301-avt_1_mcenmj.jpg"
    alt="User Avatar"
    size="xl" // Changed from "lg" to "xl"
    className="mr-4"
  />
  <div>
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Name</h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">user@example.com</p>
  </div>
</div>


        {/* Form Sections */}
        <div className="space-y-8">
          {/* Input Fields */}
          <Input
            id="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            required
          />

          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
          />

          {/* Textarea */}
          <Textarea
            id="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleInputChange('bio')}
            rows={5}
          />

          {/* Calendar */}
          <Calendar
            label="Date of Birth"
            value={formData.dob}
            onChange={handleInputChange('dob')}
          />

          {/* Select */}
          <Select
            id="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleInputChange('gender')}
            options={genderOptions}
          />

          {/* Dynamic Input List */}
          <DynamicInputList
            label="Skills"
            items={skills}
            onChange={handleSkillChange}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
          />

          {/* File Input */}
          <FileInput
            id="profile-pic"
            label="Profile Picture"
            accept="image/*"
            onChange={(e) => console.log(e.target.files)}
          />

          {/* Icon Label */}
          <div>
            <IconLabel
              icon={UserIcon}
              label="Username"
              htmlFor="username"
            />
            <Input
              id="username"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className="mt-3"
            />
          </div>

          {/* Popover */}
          <div className="relative">
            <Button
              onClick={() => setPopoverOpen(true)}
              variant="secondary"
              className="w-auto px-4"
            >
              Show Popover
            </Button>
            <Popover
              isOpen={popoverOpen}
              onClose={() => setPopoverOpen(false)}
              className="top-12 right-0 w-64"
            >
              <p className="text-gray-800 dark:text-gray-100">This is a popover content example.</p>
            </Popover>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-3 justify-end">
          <Button
            onClick={() => showAlert('Profile updated successfully!', 'success')}
            isLoading={false}
            className="w-auto px-6"
          >
            Save Profile
          </Button>
          <Button
            variant="danger"
            onClick={() => setFormData({ name: '', email: '', bio: '', dob: '', gender: '' })}
            className="w-auto px-6"
          >
            Reset
          </Button>
        </div>
      </Card>
    </ProfileLayout>
  );
};

export default UIShowcase;