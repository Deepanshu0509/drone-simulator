import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-4">
        If you have any questions or feedback, feel free to reach out to me at <a href="mailto:deepanshu.kewalramani2@gmail.com" className="text-blue-500">deepanshu.kewalramani2@gmail.com</a>.
      </p>
      <h2 className="text-2xl font-bold mb-4">Connect with Me</h2>
      <p className="text-lg mb-4">
        You can also connect with me on LinkedIn or visit my portfolio to see more of my work.
      </p>
      <ul className="list-disc list-inside">
        <li>
          <a href="https://www.linkedin.com/in/deepanshu-kewalramani/" className="text-blue-500" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://deepanshu--portfolio.vercel.app/" className="text-blue-500" target="_blank" rel="noopener noreferrer">
            Portfolio
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
