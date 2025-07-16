import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axiosConfig';
import API_URL from '../config';

const Leaderboard = ({ universeId = null }) => {
  const [activeTab, setActiveTab] = useState('universe');

  const { data: leaderboardData, isLoading, error } = useQuery(
    ['leaderboard', activeTab, universeId],
    () => axios.get(`${API_URL}/gameplay/leaderboard/`).then(res => res.data)
  );

  if (isLoading) return <div className="text-center mt-8">Loading leaderboard...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading leaderboard</div>;

  const { leaderboard_name, leaderboard_details } = leaderboardData.data;

  return (
    <div className="container mx-auto mt-8 p-6 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">{leaderboard_name}</h2>
      
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg ${activeTab === 'universe' ? 'bg-yellow-400 text-purple-900' : 'bg-purple-600 text-white'} transition-colors duration-200`}
          onClick={() => setActiveTab('universe')}
        >
          Universe
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${activeTab === 'overall' ? 'bg-yellow-400 text-purple-900' : 'bg-purple-600 text-white'} transition-colors duration-200`}
          onClick={() => setActiveTab('overall')}
        >
          Overall
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-purple-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">⭐ Score</th>
              <th className="px-4 py-3 text-center">🎁 Rewards</th>
              <th className="px-4 py-3 text-center">✅ Quests</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard_details.map((player, index) => (
              <tr
                key={player.name}
                className={`${index % 2 === 0 ? 'bg-purple-100' : 'bg-white'} transition-all duration-300 ease-in-out hover:bg-purple-200`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-4 py-3">
                  {index + 1 === 1 && '🥇'}
                  {index + 1 === 2 && '🥈'}
                  {index + 1 === 3 && '🥉'}
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-semibold">{player.name}</td>
                <td className="px-4 py-3 text-center">{player.score}</td>
                <td className="px-4 py-3 text-center">{player.rewards_collected}</td>
                <td className="px-4 py-3 text-center">{player.quests_completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;