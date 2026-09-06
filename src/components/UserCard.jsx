import axios from "axios";
import React, { useState } from "react";

const UserCard = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActioned, setIsActioned] = useState(false);
  const { _id,firstName, lastName, skills, photoUrl, about, age, gender, Skills, Bio } = user;
  const userSkills = skills || Skills;
  const userAbout = about || Bio;

  const handleRequest = async (status,_id) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        "http://localhost:3000/sent/request/"+status+"/"+_id,
        {},
        { withCredentials: true }
      );
      setIsActioned(true);
    } catch (error) {
      console.error("Request failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isActioned) return null;

  return (
    <div className="card bg-base-100 w-70 shadow-sm">
      <figure>
        <img
          className="aspect-square w-full object-cover"
          src={photoUrl}
          alt={`${firstName}'s profile`}
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {(age || gender) && (
          <p className="text-sm text-gray-500">
            {age && `${age} yrs`}
            {age && gender && " • "}
            {gender}
          </p>
        )}

        {userAbout && <p>{userAbout}</p>}

        {/* Skills */}
        <div className="card-actions justify-end">
          {userSkills?.map((skill) => (
            <div key={skill} className="badge badge-outline">
              {skill}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="btn btn-error"
            disabled={isSubmitting}
            onClick={() => handleRequest("ignored",_id)}
          >
            Ignore
          </button>

          <button
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={() => handleRequest("interested",_id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;