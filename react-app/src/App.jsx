import "./App.css";

function App() {
	const backendUrl = import.meta.env.VITE_BACKEND_HOST;

	return (
		<div className="App">
			<img
				alt="stream"
				src={`${backendUrl}/motion`}
			/>
		</div>
	);
}

export default App;
