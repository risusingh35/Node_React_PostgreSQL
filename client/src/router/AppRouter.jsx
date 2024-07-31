import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import About from '../pages/about/About';
import UserList from '../pages/user/UserList'
import AddUpdate from '../pages/user/AddUpdate'
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/users" element={<UserList />} />
        <Route exact path="/users/add-update" element={<AddUpdate />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
