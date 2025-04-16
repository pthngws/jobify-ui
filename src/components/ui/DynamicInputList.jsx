import React from 'react';
import Input from './Input';
import Button from './Button';


const DynamicInputList = ({
  label,
  items = [],
  onChange,
  onAdd,
  onRemove,
  disabled = false
}) => {
  return (
    <div className="mt-6">
      {label && (
        <label className="text-gray-700 dark:text-gray-200 text-base font-semibold block mb-3">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <Input
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`Enter ${label ? label.toLowerCase() : 'item'} ${index + 1}`}
              disabled={disabled}
              className="flex-1 py-2.5" // Match padding with button
            />
            <Button
              variant="danger"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className="w-20 py-2.5 text-sm" // Match padding with input
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="primary"
        onClick={onAdd}
        disabled={disabled}
        className="mt-4 w-full sm:w-auto px-6 py-2 text-sm"
      >
        Add {label ? label.toLowerCase() : 'item'}
      </Button>
    </div>
  );
};

export default DynamicInputList;

