const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			registro: async(email, password) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/registro`, {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({email, password})
					})
					if(!response.ok) throw new Error("error en el registro");
					const data = await response.json()
					console.log(data)
				} catch (error){
					console.log(error)
					return false
				}
			},

			login: async (email, password) => {
				try {
					const response =await fetch(process.env.BACKEND_URL+ '/api/login',{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(email, password)
					})
					if(!response.ok) throw new Error("error al iniciar sesión");
					const data = await response.json()
					console.log(data)
					localStorage.setItem('token', data.token)
					setStore({auth: true, token: data.token})
					return true
				} catch (error) {
					console.error(error)
					return false
				}
			},

			protregido: async() => {
				const token = sessionStorage.getItem('token');
				const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
					headers: {'Authorization': `Bearer ${token}`}
				});
				return await response.json();
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
