import React from 'react';

interface InfoBoxProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ icon, title, text }) => {
  return (
    <div className="bg-blue-50 p-5 rounded-lg my-6 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-blue-600 text-xl">{icon}</span>
        <p className="font-medium text-blue-700">{title}</p>
      </div>
      <p className="text-sm text-blue-600 text-center">{text}</p>
    </div>
  );
};

export default InfoBox;