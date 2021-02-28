import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ account }) => {
  function truncAcc(address) {
    if (address === null || address === undefined) {
      return;
    }
    const start4Digits = address.slice(0, 6);
    const separator = '...';
    const last4Digits = address.slice(-4);
    return (
      start4Digits.padStart(2, '0') +
      separator.padStart(2, '0') +
      last4Digits.padStart(2, '0')
    );
  }
  return (
    // <nav className="navbar navbar-dark bg-dark shadow mb-5">
    //   <p className="navbar-brand my-auto">react website</p>
    //   <ul className="navbar-nav">
    // <li className="nav-item text-white">{account}</li>
    // </ul>
    // </nav>
    <div className='navbar'>
      <div className='nav-heading'>IVCO</div>
      <button className='nav-acc-btn btn'>{account}</button>
    </div>
  );
};

export default Navbar;
