import { useEffect, useMemo, useState } from "react";

const ADMIN = {
  id: 1,
  name: "Admin",
  email: "admin@gmail.com",
  password: "admin",
  role: "ADMIN",
  city: "Bhopal",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const defaultStorage = {
  "A+": 5,
  "A-": 2,
  "B+": 4,
  "B-": 1,
  "O+": 6,
  "O-": 2,
  "AB+": 3,
  "AB-": 1,
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [storage, setStorage] = useState(defaultStorage);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("bs_users")) || [];
    const adminExists = savedUsers.some((u) => u.email === ADMIN.email);
    const finalUsers = adminExists ? savedUsers : [ADMIN, ...savedUsers];

    setUsers(finalUsers);
    setDonations(JSON.parse(localStorage.getItem("bs_donations")) || []);
    setRequests(JSON.parse(localStorage.getItem("bs_requests")) || []);
    setStorage(JSON.parse(localStorage.getItem("bs_storage")) || defaultStorage);

    localStorage.setItem("bs_users", JSON.stringify(finalUsers));
  }, []);

  useEffect(() => {
    localStorage.setItem("bs_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("bs_donations", JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem("bs_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("bs_storage", JSON.stringify(storage));
  }, [storage]);

  const login = (email, password) => {
    let allUsers = JSON.parse(localStorage.getItem("bs_users")) || [];

    if (!allUsers.some((u) => u.email === ADMIN.email)) {
      allUsers = [ADMIN, ...allUsers];
      localStorage.setItem("bs_users", JSON.stringify(allUsers));
      setUsers(allUsers);
    }

    const found = allUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      alert("Invalid login details");
      return;
    }

    setCurrentUser(found);
    setScreen("dashboard");
  };

  const register = (form) => {
    if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      alert("Email already exists");
      return;
    }

    const newUser = { ...form, id: Date.now() };
    setUsers([...users, newUser]);
    alert("Registration successful. Please login.");
    setAuthMode("login");
  };

  if (screen === "dashboard" && currentUser) {
    return (
      <DashboardLayout user={currentUser} logout={() => {
        setCurrentUser(null);
        setScreen("home");
      }}>
        {currentUser.role === "ADMIN" && (
          <AdminDashboard
            users={users}
            donations={donations}
            requests={requests}
            setRequests={setRequests}
            storage={storage}
            setStorage={setStorage}
          />
        )}

        {currentUser.role === "DONOR" && (
          <DonorDashboard
            user={currentUser}
            donations={donations}
            setDonations={setDonations}
            storage={storage}
            setStorage={setStorage}
          />
        )}

        {currentUser.role === "HOSPITAL" && (
          <HospitalDashboard
            user={currentUser}
            requests={requests}
            setRequests={setRequests}
            storage={storage}
          />
        )}
      </DashboardLayout>
    );
  }

  if (screen === "auth") {
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        login={login}
        register={register}
        goHome={() => setScreen("home")}
      />
    );
  }

  return (
    <HomePage
      goLogin={() => {
        setAuthMode("login");
        setScreen("auth");
      }}
      goRegister={() => {
        setAuthMode("register");
        setScreen("auth");
      }}
    />
  );
}

function HomePage({ goLogin, goRegister }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-red-600">BloodSync</h1>

          <div className="hidden md:flex gap-8 text-slate-700 font-medium">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#process">Process</a>
            <a href="#about">About</a>
          </div>

          <button
            onClick={goLogin}
            className="bg-red-600 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Login
          </button>
        </div>
      </nav>

      <section
        id="home"
        className="pt-32 pb-20 bg-gradient-to-br from-red-50 via-white to-rose-100"
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold text-sm">
              Smart Blood Management System
            </p>

            <h2 className="mt-6 text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Save Lives With Smart Blood Donation
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              BloodSync connects donors, hospitals and admin in one modern
              platform. Donors donate blood, hospitals request blood and admin
              manages storage with approval system.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={goRegister}
                className="bg-red-600 text-white px-7 py-3 rounded-xl font-bold shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={goLogin}
                className="border border-red-600 text-red-600 px-7 py-3 rounded-xl font-bold"
              >
                Login
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl p-8 border">
            <div className="grid grid-cols-2 gap-5">
              <HeroCard title="Donors" value="Donate Blood" />
              <HeroCard title="Hospitals" value="Request Blood" />
              <HeroCard title="Admin" value="Approve / Reject" />
              <HeroCard title="Storage" value="Live Units" />
            </div>

            <div className="mt-8 bg-red-50 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-slate-800">
                Blood Availability
              </h3>
              {bloodGroups.slice(0, 5).map((b, i) => (
                <div key={b} className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{b}</span>
                    <span>{8 - i} units</span>
                  </div>
                  <div className="h-3 bg-red-100 rounded-full mt-1">
                    <div
                      className="h-3 bg-red-600 rounded-full"
                      style={{ width: `${90 - i * 12}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="Powerful Features" />

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <Feature
              title="Donor Dashboard"
              desc="Donor can login and add how many units of blood they want to donate."
            />
            <Feature
              title="Hospital Dashboard"
              desc="Hospital can create blood request according to required blood group and units."
            />
            <Feature
              title="Admin Control"
              desc="Admin can approve or reject requests according to available blood storage."
            />
          </div>
        </div>
      </section>

      <section id="process" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="How It Works" />

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <Step no="01" title="Register" desc="Donor or hospital creates account." />
            <Step no="02" title="Donate" desc="Donor adds blood donation units." />
            <Step no="03" title="Request" desc="Hospital requests required blood." />
            <Step no="04" title="Approve" desc="Admin approves based on storage." />
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-red-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold">BloodSync Management System</h2>
          <p className="mt-5 text-red-100 text-lg">
            A modern React and Tailwind CSS based role management project with
            localStorage support, dashboard, blood records, hospital requests and
            graphical storage representation.
          </p>
        </div>
      </section>

      <footer className="bg-slate-950 text-white text-center py-6">
        © 2026 BloodSync. All rights reserved.
      </footer>
    </div>
  );
}

function AuthPage({ mode, setMode, login, register, goHome }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "DONOR",
    city: "",
    bloodGroup: "A+",
  });

  const submit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      login(form.email, form.password);
    } else {
      register(form);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-10 flex flex-col justify-center">
          <button onClick={goHome} className="text-left mb-8 font-semibold">
            ← Back Home
          </button>

          <h1 className="text-4xl font-extrabold">BloodSync</h1>
          <p className="mt-4 text-red-100">
            Login according to your role and manage donation, request and blood
            storage.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-8">
            <Mini title="Admin" />
            <Mini title="Donor" />
            <Mini title="Hospital" />
          </div>
        </div>

        <form onSubmit={submit} className="p-10">
          <h2 className="text-3xl font-extrabold text-center text-slate-900">
            {mode === "login" ? "Login" : "Register"}
          </h2>

          <div className="mt-8 space-y-4">
            {mode === "register" && (
              <>
                <Input
                  placeholder="Name / Hospital Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <select
                  className="input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="DONOR">Donor</option>
                  <option value="HOSPITAL">Hospital</option>
                </select>

                {form.role === "DONOR" && (
                  <select
                    className="input"
                    value={form.bloodGroup}
                    onChange={(e) =>
                      setForm({ ...form, bloodGroup: e.target.value })
                    }
                  >
                    {bloodGroups.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                )}

                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </div>

          <p className="text-center mt-5">
            {mode === "login" ? "New user?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-red-600 font-bold"
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #dc2626;
        }
      `}</style>
    </div>
  );
}

function DashboardLayout({ user, logout, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white px-6 py-4 shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-red-600">BloodSync</h1>
          <p className="text-sm text-slate-500">
            {user.name} • {user.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-slate-900 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}

function DonorDashboard({ user, donations, setDonations, storage, setStorage }) {
  const [units, setUnits] = useState("");
  const myDonations = donations.filter((d) => d.donorEmail === user.email);

  const donate = (e) => {
    e.preventDefault();

    const unit = Number(units);
    if (unit <= 0) return alert("Enter valid blood units");

    const donation = {
      id: Date.now(),
      donorName: user.name,
      donorEmail: user.email,
      bloodGroup: user.bloodGroup,
      units: unit,
      date: new Date().toLocaleDateString(),
    };

    setDonations([...donations, donation]);

    setStorage({
      ...storage,
      [user.bloodGroup]: Number(storage[user.bloodGroup] || 0) + unit,
    });

    setUnits("");
    alert("Blood donation added successfully");
  };

  return (
    <>
      <Title text="Donor Dashboard" />
      <Stats
        data={[
          ["Blood Group", user.bloodGroup],
          ["Donation Count", myDonations.length],
          ["Total Units", myDonations.reduce((s, d) => s + d.units, 0)],
        ]}
      />

      <Card title="Donate Blood">
        <form onSubmit={donate} className="grid md:grid-cols-3 gap-4">
          <Input value={user.bloodGroup} disabled />
          <Input
            type="number"
            placeholder="How many units?"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          <button className="bg-red-600 text-white rounded-xl font-bold">
            Submit Donation
          </button>
        </form>
      </Card>

      <Graph data={storage} title="Current Blood Storage" />
      <DonationTable donations={myDonations} title="My Donation History" />
    </>
  );
}

function HospitalDashboard({ user, requests, setRequests, storage }) {
  const [form, setForm] = useState({ bloodGroup: "A+", units: "" });
  const myRequests = requests.filter((r) => r.hospitalEmail === user.email);

  const requestBlood = (e) => {
    e.preventDefault();

    const unit = Number(form.units);
    if (unit <= 0) return alert("Enter valid units");

    setRequests([
      ...requests,
      {
        id: Date.now(),
        hospitalName: user.name,
        hospitalEmail: user.email,
        bloodGroup: form.bloodGroup,
        units: unit,
        status: "Pending",
        date: new Date().toLocaleDateString(),
      },
    ]);

    setForm({ bloodGroup: "A+", units: "" });
    alert("Request sent to admin");
  };

  return (
    <>
      <Title text="Hospital Dashboard" />
      <Stats
        data={[
          ["Total Requests", myRequests.length],
          ["Pending", myRequests.filter((r) => r.status === "Pending").length],
          ["Approved", myRequests.filter((r) => r.status === "Approved").length],
          ["Rejected", myRequests.filter((r) => r.status === "Rejected").length],
        ]}
      />

      <Card title="Request Blood">
        <form onSubmit={requestBlood} className="grid md:grid-cols-3 gap-4">
          <select
            className="input"
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          >
            {bloodGroups.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <Input
            type="number"
            placeholder="Required units"
            value={form.units}
            onChange={(e) => setForm({ ...form, units: e.target.value })}
          />

          <button className="bg-red-600 text-white rounded-xl font-bold">
            Send Request
          </button>
        </form>
      </Card>

      <Graph data={storage} title="Available Blood Storage" />
      <RequestTable requests={myRequests} title="My Blood Requests" />
    </>
  );
}

function AdminDashboard({
  users,
  donations,
  requests,
  setRequests,
  storage,
  setStorage,
}) {
  const approve = (req) => {
    const available = Number(storage[req.bloodGroup] || 0);

    if (available < req.units) {
      alert("Not enough blood storage");
      return;
    }

    setStorage({
      ...storage,
      [req.bloodGroup]: available - req.units,
    });

    setRequests(
      requests.map((r) =>
        r.id === req.id ? { ...r, status: "Approved" } : r
      )
    );
  };

  const reject = (id) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "Rejected" } : r
      )
    );
  };

  return (
    <>
      <Title text="Admin Dashboard" />
      <Stats
        data={[
          ["Donors", users.filter((u) => u.role === "DONOR").length],
          ["Hospitals", users.filter((u) => u.role === "HOSPITAL").length],
          ["Donations", donations.length],
          ["Requests", requests.length],
        ]}
      />

      <Graph data={storage} title="Blood Storage Graph" />

      <Table title="Hospital Requests">
        <thead>
          <tr>
            <Th>Hospital</Th>
            <Th>Blood</Th>
            <Th>Units</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <Td>{r.hospitalName}</Td>
              <Td>{r.bloodGroup}</Td>
              <Td>{r.units}</Td>
              <Td>{r.status}</Td>
              <Td>
                {r.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => approve(r)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => reject(r.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  "-"
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DonationTable donations={donations} title="All Donor Blood Records" />
    </>
  );
}

function Title({ text }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-extrabold text-slate-800">{text}</h2>
      <p className="text-slate-500">Role based BloodSync system</p>
    </div>
  );
}

function Stats({ data }) {
  return (
    <div className="grid md:grid-cols-4 gap-5 mb-6">
      {data.map(([label, value]) => (
        <div key={label} className="bg-white p-6 rounded-2xl shadow">
          <p className="text-slate-500 text-sm">{label}</p>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
            {value}
          </h3>
        </div>
      ))}
    </div>
  );
}

function Graph({ data, title }) {
  const max = Math.max(...Object.values(data), 1);

  return (
    <Card title={title}>
      <div className="space-y-4">
        {Object.entries(data).map(([blood, unit]) => (
          <div key={blood}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-bold">{blood}</span>
              <span>{unit} units</span>
            </div>
            <div className="h-4 bg-red-100 rounded-full">
              <div
                className="h-4 bg-red-600 rounded-full"
                style={{ width: `${(unit / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DonationTable({ donations, title }) {
  return (
    <Table title={title}>
      <thead>
        <tr>
          <Th>Donor</Th>
          <Th>Blood</Th>
          <Th>Units</Th>
          <Th>Date</Th>
        </tr>
      </thead>
      <tbody>
        {donations.map((d) => (
          <tr key={d.id}>
            <Td>{d.donorName}</Td>
            <Td>{d.bloodGroup}</Td>
            <Td>{d.units}</Td>
            <Td>{d.date}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function RequestTable({ requests, title }) {
  return (
    <Table title={title}>
      <thead>
        <tr>
          <Th>Blood</Th>
          <Th>Units</Th>
          <Th>Status</Th>
          <Th>Date</Th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.id}>
            <Td>{r.bloodGroup}</Td>
            <Td>{r.units}</Td>
            <Td>{r.status}</Td>
            <Td>{r.date}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Table({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="w-full text-left">{children}</table>
    </div>
  );
}

function Input(props) {
  return <input required className="input" {...props} />;
}

function Th({ children }) {
  return <th className="border-b p-3 text-slate-600">{children}</th>;
}

function Td({ children }) {
  return <td className="border-b p-3 text-slate-700">{children}</td>;
}

function HeroCard({ title, value }) {
  return (
    <div className="bg-slate-50 p-5 rounded-2xl border">
      <p className="text-slate-500">{title}</p>
      <h3 className="font-extrabold text-xl text-slate-800 mt-2">{value}</h3>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow border">
      <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
      <p className="mt-4 text-slate-600">{desc}</p>
    </div>
  );
}

function Step({ no, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow">
      <p className="text-red-600 font-extrabold text-3xl">{no}</p>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-slate-600">{desc}</p>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-3 text-slate-500">
        Modern dashboard system using React, Tailwind CSS and localStorage
      </p>
    </div>
  );
}

function Mini({ title }) {
  return (
    <div className="bg-white/20 rounded-2xl p-4 text-center font-bold">
      {title}
    </div>
  );
}