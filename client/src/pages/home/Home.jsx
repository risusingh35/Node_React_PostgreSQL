import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    alert('Mounting Component');

    return () => {
      alert('Un-Mounting Component');
    };
  }, []);

  return <h1>Home</h1>;
};

export default Home;
