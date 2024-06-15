import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">About Drone Simulator</h1>
      <p className="text-lg mb-4">
        The Drone Simulator is a web application that allows users to simulate drone movements on a map.
        You can upload CSV files containing coordinates and simulate the movement of multiple drones in parallel.
      </p>
      <h2 className="text-2xl font-bold mt-10">About the Owner</h2>
      <div className='flex flex-row items-center '>
      <p className="text-lg mb-4 w-1/2">
        Hi, I'm Deepanshu Kewalramani, the creator of the Drone Simulator. I have a passion for technology and
        have been working on various projects in web development and drone technology. This project
        is a culmination of my interests in mapping, simulations, and user experience design.
      </p>
      <div className="w-96 flex justify-center">
            <img src="/profile.jpg" alt="Deepanshu" className="rounded-full h-48 w-48 object-cover" />
        </div>
      </div>
      
    </div>
  );
};

export default About;
