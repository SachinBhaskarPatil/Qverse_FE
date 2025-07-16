import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link'
import axios from '../utils/axiosConfig';
import API_URL from '../config';

function UniverseList() {
  const { data: universes, isLoading, error } = useQuery(['universes'], () =>
    axios.get(`${API_URL}/generator/universes/`).then(res => res.data)
  );

  if (isLoading) return <div className="text-center mt-8">Loading universes...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading universes</div>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Choose a Universe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universes.map(universe => (
          <Link
            key={universe.id}
            href={`/quests/${universe.id}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{universe.universe_name}</h3>
            <p className="text-gray-600">{universe.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default UniverseList;