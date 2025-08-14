import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Row, Col, Card, Modal, Form } from "react-bootstrap";
import { FaUsers, FaUserTie, FaGamepad, FaRupeeSign } from "react-icons/fa";
import Loader from "./Loader";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [modalContent, setModalContent] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [gamestore, setGameStore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState("all");
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topGames, setTopGames] = useState([]);

  const [filteredCounts, setFilteredCounts] = useState({
    customers: 0,
    employees: 0,
    games: 0,
    revenue: 0,
  });

  const fetchData = async () => {
    try {
      const [
        custRes,
        empRes,
        storeRes,
        weeklyRes,
        monthlyRes,
        topCustRes,
        topGameRes,
      ] = await Promise.all([
        fetch("https://gamezonecrm.onrender.com/api/admin/active"),
        fetch("https://gamezonecrm.onrender.com/api/admin/staff"),
        fetch("https://gamezonecrm.onrender.com/api/admindashboard/getall-store"),
        fetch("https://gamezonecrm.onrender.com/api/admindashboard/getdata-by-week"),
        fetch("https://gamezonecrm.onrender.com/api/admindashboard/getdata-by-month"),
        fetch("https://gamezonecrm.onrender.com/api/admindashboard/get-top-customers"),
        fetch("https://gamezonecrm.onrender.com/api/admindashboard/get-top-games"),
      ]);

      const customersData = await custRes.json();
      const employeesData = await empRes.json();
      const storeData = await storeRes.json();
      const weeklyData = await weeklyRes.json();
      const monthlyData = await monthlyRes.json();
      const topCustomersData = await topCustRes.json();
      const topGamesData = await topGameRes.json();

      setCustomers(customersData);
      setEmployees(employeesData);
      setGameStore(storeData);

      // Weekly Revenue
      const selectedStoreInt =
        selectedStore === "all" ? null : parseInt(selectedStore);

      const weeklyForChart = weeklyData
        .filter(
          (store) =>
            selectedStoreInt === null || store.store === selectedStoreInt
        )
        .map((store) => {
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          return days.map((day) => ({
            name: day,
            revenue:
              (store[day]?.total_amount || 0) +
              (store[day]?.extended_amount || 0) +
              (store[day]?.extraSnacksPrice || 0),
          }));
        })
        .flat();

      setRevenueData(weeklyForChart);

      // Monthly Revenue
      const monthly =
        selectedStore === "all"
          ? Object.entries(monthlyData).flatMap(([storeKey, dates]) =>
              Object.entries(dates).map(([date, val]) => ({
                name: `Store ${storeKey} (${date})`,
                revenue:
                  (val.total_amount || 0) +
                  (val.extended_amount || 0) +
                  (val.extraSnacksPrice || 0),
              }))
            )
          : Object.entries(monthlyData[selectedStore] || {}).map(
              ([date, val]) => ({
                name: date,
                revenue:
                  (val.total_amount || 0) +
                  (val.extended_amount || 0) +
                  (val.extraSnacksPrice || 0),
              })
            );

      setMonthlyRevenue(monthly);

      // Top Customers
      const topCust =
        selectedStore === "all"
          ? topCustomersData.flatMap((s) =>
              s.topCustomers.map((c) => ({
                ...c,
                store: s.store,
                name: `Store ${s.store}: ${c.name}`,
              }))
            )
          : topCustomersData.find((s) => String(s.store) === selectedStore)
              ?.topCustomers || [];

      setTopCustomers(topCust);

      // Top Games
      const topGame =
        selectedStore === "all"
          ? topGamesData.flatMap((s) =>
              s.topGames.map((g) => ({
                ...g,
                store: s.store,
                game: `Store ${s.store}: ${g.game}`,
                count: g.currentMonthCount,
              }))
            )
          : topGamesData
              .find((s) => String(s.store) === selectedStore)
              ?.topGames.map((g) => ({
                ...g,
                count: g.currentMonthCount,
              })) || [];

      setTopGames(topGame);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStore]);

  useEffect(() => {
    const filteredCust =
      selectedStore === "all"
        ? customers
        : customers.filter((c) => String(c.store) === selectedStore);

    const filteredEmp =
      selectedStore === "all"
        ? employees
        : employees.filter((e) => String(e.store) === selectedStore);

    const storeSubset =
      selectedStore === "all"
        ? gamestore
        : gamestore.filter((s) => String(s.number) === selectedStore);

    // Safely calculate games
    const games = Array.isArray(storeSubset)
      ? storeSubset.reduce((sum, s) => sum + (parseInt(s.totalGames) || 0), 0)
      : 0;

    const totalRevenue = revenueData.reduce(
      (sum, b) => sum + (b.revenue || 0),
      0
    );

    setFilteredCounts({
      customers: filteredCust.length,
      employees: filteredEmp.length,
      games,
      revenue: totalRevenue,
    });
  }, [selectedStore, customers, employees, gamestore, revenueData]);

  const openModal = (title, content) => setModalContent({ title, content });
  const closeModal = () => setModalContent(null);

  const cardStyle = {
    cursor: "pointer",
    padding: "6px 10px",
    transition: "transform 0.2s ease",
    minHeight: "60px",
    borderRadius: "6px",
  };

  const iconSize = 14;

  if (loading) return <Loader />;

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <Form.Select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-auto"
        >
          <option value="all">All Stores</option>
          {Array.isArray(gamestore) &&
            gamestore.map((store) => (
              <option key={store.id} value={String(store.number)}>
                Store {store.number}
              </option>
            ))}
        </Form.Select>
        {Array.isArray(gamestore) && gamestore.length === 0 && (
          <div className="text-danger mt-2">
            No stores found or failed to load store data.
          </div>
        )}
      </div>

      <Row className="mb-3 g-2">
        <Col xs={12} md={3}>
          <Card
            className="text-center text-white bg-primary shadow-sm"
            style={cardStyle}
          >
            <FaUsers size={iconSize} />
            <div>Total Customers</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              {filteredCounts.customers}
            </div>
          </Card>
        </Col>

        <Col xs={12} md={3}>
          <Card
            className="text-center text-white bg-success shadow-sm"
            style={cardStyle}
          >
            <FaUserTie size={iconSize} />
            <div>Total Employees</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              {filteredCounts.employees}
            </div>
          </Card>
        </Col>

        <Col xs={12} md={3}>
          <Card
            className="text-center text-dark bg-warning shadow-sm"
            style={cardStyle}
          >
            <FaGamepad size={iconSize} />
            <div>Total Games</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              {filteredCounts.games}
            </div>
          </Card>
        </Col>

        <Col xs={12} md={3}>
          <Card
            className="text-center text-white bg-danger shadow-sm"
            style={cardStyle}
          >
            <FaRupeeSign size={iconSize} />
            <div>Total Revenue</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>
              ₹{filteredCounts.revenue.toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3 g-3">
        <Col xs={12} md={6}>
          <Card
            className="p-2 shadow-sm"
            onClick={() =>
              openModal(
                "Weekly Revenue",
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          >
            <h6>Weekly Revenue</h6>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={revenueData}>
                <Line dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card
            className="p-2 shadow-sm"
            onClick={() =>
              openModal(
                "Monthly Revenue",
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyRevenue}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          >
            <h6>Monthly Revenue</h6>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={monthlyRevenue}>
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card
            className="p-2 shadow-sm"
            onClick={() =>
              openModal(
                "Most Played Games",
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={topGames}
                      dataKey="count"
                      nameKey="game"
                      outerRadius={120}
                      label
                    >
                      {topGames.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
          >
            <h6>Most Played Games</h6>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={topGames}
                  dataKey="count"
                  nameKey="game"
                  outerRadius={60}
                >
                  {topGames.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card
            className="p-2 shadow-sm"
            onClick={() =>
              openModal(
                "Top Customers",
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topCustomers}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          >
            <h6>Top Customers</h6>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={topCustomers}>
                <Bar dataKey="bookingCount" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Modal show={!!modalContent} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent?.content}</Modal.Body>
      </Modal>
    </div>
  );
}
