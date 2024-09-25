import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaIndianRupeeSign, FaPlus, FaMinus, FaBell } from "react-icons/fa6";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useUser } from '../../UserContxt';

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



const Dashboard = () => {
    const [weeklyData, setWeeklyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chart, setChart] = useState({
        labels: [],
        datasets: []
    });
    const [transactionInfo, setTransactionInfo] = useState({});
    const { user } = useUser()


    const fetchTransactionInfo = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get("http://localhost:3000/api/v1/account/dashboard-transaction-info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.msg === "no transaction done") {
                setError("No transactions found for this user.");
            } else {
                setTransactionInfo(response.data);
                console.log(response.data)
            }
        } catch (err) {
            console.error("Error fetching transaction info: ", err);
            setError("An error occurred while fetching the transaction info.");
        } finally {
            setLoading(false);
        }
    };
    const notifications = [
        { message: `Payment received from ${transactionInfo?.lastTransaction?.received_by ? transactionInfo.lastTransaction.received_by : "None"}` },
        { message: "Your weekly report is ready" },
        { message: `Payment sent to ${transactionInfo?.lastTransaction?.send_to ? transactionInfo.lastTransaction.send_to : "None"}` }
    ];
       

    const fetchWeeklyTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/v1/account/transaction-weekly-data', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWeeklyData(response.data);
        } catch (err) {
            setError("Failed to fetch data. Please try again.");
            console.error("Error fetching weekly transactions: ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeeklyTransactions();
        fetchTransactionInfo();
    }, []);

    useEffect(() => {
        if (!loading && weeklyData) {
            setChart({
                labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                datasets: [
                    {
                        label: 'Received',
                        data: [
                            weeklyData.Sun?.received || 0,
                            weeklyData.Mon?.received || 0,
                            weeklyData.Tue?.received || 0,
                            weeklyData.Wed?.received || 0,
                            weeklyData.Thu?.received || 0,
                            weeklyData.Fri?.received || 0,
                            weeklyData.Sat?.received || 0,
                        ],
                        fill: true,
                        borderColor: "rgba(0, 187, 0, 0.9)",
                        backgroundColor: "rgba(134, 255, 134, 0.2)",
                        tension: 0.4
                    },
                    {
                        label: 'Sent',
                        data: [
                            weeklyData.Sun?.sent || 0,
                            weeklyData.Mon?.sent || 0,
                            weeklyData.Tue?.sent || 0,
                            weeklyData.Wed?.sent || 0,
                            weeklyData.Thu?.sent || 0,
                            weeklyData.Fri?.sent || 0,
                            weeklyData.Sat?.sent || 0,
                        ],
                        fill: true,
                        borderColor: "rgba(255, 99, 132, 0.9)",
                        backgroundColor: "rgba(255, 99, 132, 0.3)",
                        tension: 0.4
                    }
                ]
            });
        }
    }, [weeklyData, loading]);

    return (
        <div className='lg:h-[93.3vh] '>
            <div className="bg-slate-800 flex flex-col items-center justify-start  lg:h-[93.3vh] p-4">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                    <div className="lg:col-span-2 bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl shadow-slate-900 text-white">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 lg:mb-8">
                            Welcome, {user.firstName} {' '} {user.lastName}!
                        </h1>

                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">Last Transaction</h2>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                                <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                    <FaPlus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.lastTransaction?.money_sent ?? 0}
                                </div>
                                <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                    <FaMinus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.lastTransaction?.money_received ?? 0}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">Today's Summary</h2>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                                <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                    <FaPlus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.today?.totalReceived ?? 0}
                                </div>
                                <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                    <FaMinus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.today?.totalSent ?? 0}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">This Week's Summary</h2>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-center text-lg">
                                <div className="flex items-center text-green-400 justify-start font-bold mb-4 sm:mb-0">
                                    <FaPlus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.currentMonth?.totalReceived ?? 0}
                                </div>
                                <div className="flex items-center text-red-400 justify-start font-bold sm:justify-end">
                                    <FaMinus size={20} className="mr-2" />
                                    <FaIndianRupeeSign className="mr-1" />
                                    {transactionInfo.currentMonth?.totalSent ?? 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl shadow-slate-900 text-white">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 flex items-center">
                            <FaBell className="mr-2" /> Notifications
                        </h2>
                        <hr className="bg-gray-700 h-0.5 shadow-sm shadow-black my-0.5 w-3/5 rounded-xl" />
                        <ul className="space-y-2 mt-6">
                            {notifications.map((notification, index) => (
                                <li key={index} className="border-b border-gray-700 pb-4 flex flex-col items-center justify-center gap-4">
                                    <div className="text-md md:text-lg lg:text-xl font-semibold">
                                        {notification.message}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-full lg:w-3/4  flex-grow">
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
                                    intersect: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        color: '#ffffff',
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                y: {
                                    ticks: {
                                        color: '#ffffff',
                                        font: {
                                            size: 12
                                        }
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
