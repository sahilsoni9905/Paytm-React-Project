import React, { useEffect, useState } from 'react';
import { FaIndianRupeeSign, FaPlus, FaMinus, FaBell } from "react-icons/fa6";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement, 
    Title,
    Tooltip,
    Legend,
    Filler
);

const data = {
    name: "Kevin Martin",
    totalSent: 30700,
    totalReceived: 25700,
    totalSentToday: 30000,
    totalReceivedToday: 45700,
    lastSent: 10700,
    lastReceived: 25700,
    totalSentThisMonth: 45000,
    totalReceivedThisMonth: 50000
};

const weeklyTransactions = [
    { day: "Monday", moneyReceived: 1000, moneySent: 1200 },
    { day: "Tuesday", moneyReceived: 200, moneySent: 2100 },
    { day: "Wednesday", moneyReceived: 1800, moneySent: 1500 },
    { day: "Thursday", moneyReceived: 2500, moneySent: 2300 },
    { day: "Friday", moneyReceived: 4000, moneySent: 3800 },
    { day: "Saturday", moneyReceived: 2200, moneySent: 2000 },
    { day: "Sunday", moneyReceived: 2900, moneySent: 2600 },
];

const notifications = [
    { message: "Payment received from John", time: "2 hours ago" },
    { message: "Your monthly report is ready", time: "1 day ago" },
    { message: "Payment sent to Sarah", time: "3 days ago" },
];

const Dashboard = () => {
    const [chart, setChart] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        setChart({
            labels: weeklyTransactions.map(item => item.day),
            datasets: [
                {
                    label: 'Received',
                    data: weeklyTransactions.map(item => item.moneyReceived),
                    fill: true,
                    borderColor: "rgba(0, 187, 0, 0.9)",
                    backgroundColor: "rgba(134, 255, 134, 0.2)",
                    tension: 0.4
                },
                {
                    label: 'Sent',
                    data: weeklyTransactions.map(item => item.moneySent),
                    fill: true,
                    borderColor: "rgba(255, 99, 132, 0.9)",
                    backgroundColor: "rgba(255, 99, 132, 0.3)",
                    tension: 0.4
                }
            ]
        });
    }, []);

    return (
        <div className='lg:h-[93.1vh] overflow-y-hidden overflow-y-scroll'>
            <div className="bg-slate-800 flex flex-col items-center justify-start  lg:h-[93.1vh] p-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                <div className="lg:col-span-2 bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl shadow-slate-900 text-white">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8">
                        Welcome, {data.name}!
                    </h1>

                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">Last Transaction</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                            <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                <FaPlus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.lastReceived.toLocaleString()}
                            </div>
                            <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                <FaMinus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.lastSent.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">Today's Summary</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                            <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                <FaPlus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.totalReceivedToday.toLocaleString()}
                            </div>
                            <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                <FaMinus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.totalSentToday.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">This Month's Summary</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                            <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                <FaPlus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.totalReceivedThisMonth.toLocaleString()}
                            </div>
                            <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                <FaMinus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {data.totalSentThisMonth.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl shadow-slate-900 text-white">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 flex items-center">
                        <FaBell className="mr-2" /> Notifications
                    </h2>
                    <hr className="bg-gray-700 h-0.5 shadow-sm shadow-black  my-0.5 w-3/5  rounded-xl" />
                    <ul className="space-y-2 mt-6">
                        {notifications.map((notification, index) => (
                            <li key={index} className="border-b border-gray-700 pb-2 flex flex-col items-center justify-center gap-4">
                                <div className="text-md md:text-lg lg:text-xl font-semibold">
                                    {notification.message}
                                </div>
                                <div className="text-sm text-gray-400 self-start">{notification.time}</div>
                                <hr className="bg-gray-700 h-1 shadow-sm shadow-black  my-0.5 w-full  rounded-xl" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full lg:w-3/4 mt-4  flex-grow">
                <Line className='h-72 lg:h-auto'
                    data={chart}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: "top", labels: { color: '#ffffff' } },
                            title: {
                                display: true,
                                text: "Weekly Transactions",
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                    family: 'Arial'
                                },
                                color: "#ffffff"
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false, 
                                backgroundColor: "rgba(0,0,0,0.7)",
                                titleFont: {
                                    size: 12
                                },
                                bodyFont: {
                                    size: 10
                                }
                            },
                            animation: {
                                duration: 800,
                                easing: 'easeOutCubic',
                            }
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    font: {
                                        size: 12,
                                    },
                                    color: "#ffffff"
                                }
                            },
                            y: {
                                grid: {
                                    color: "rgba(255, 255, 255, 0.2)"
                                },
                                ticks: {
                                    font: {
                                        size: 12,
                                    },
                                    color: "#ffffff",
                                    callback: (value) => `₹${value}`
                                }
                            }
                        }
                    }}
                />
            </div> 
        </div>
        </div>
    );
};

export default Dashboard;
