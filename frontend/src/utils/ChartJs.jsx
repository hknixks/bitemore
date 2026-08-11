import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartJs = () => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy(); 
        }

        if (chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["Sep","Oct","Nov","Dec", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [{
                        label: 'Number of Orders',
                        data: [25, 10, 30, 34, 50, 70, 65, 60, 85, 90],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Month'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Number of Orders'
                            }
                        }
                    }
                }
            });
        }
    }, []);

    return (
        <>
            <div style={{ margin: '0 auto' }} className='w-full'>
                <canvas ref={chartContainer} width="800" height="400"></canvas>
            </div>
        </>
    )
}

export default ChartJs