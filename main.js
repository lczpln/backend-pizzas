const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');

app.use(cors());

// For test proposes, the "database" is described bellow
const ingredients = {
	1: {id: 1, name: 'Molho', price: 0.80},
	2: {id: 2, name: 'Queijo', price: 1.50},
	3: {id: 3, name: 'Calabresa', price: 3.00},
	4: {id: 4, name: 'Presunto', price: 2.00},
	5: {id: 5, name: 'Bacon', price: 2.00},
	6: {id: 6, name: 'Ovo', price: 1.20},
	7: {id: 7, name: 'Orégano', price: 0.50}
}

const pizzas = {
	1: {id: 1, name: 'Mussarela', ingredients: [1, 2, 7], image: 'https://bit.ly/2UFRM1m'},
	2: {id: 2, name: 'Bacon', ingredients: [1, 2, 5, 7], image: 'https://bit.ly/2XWobTb'},
	3: {id: 3, name: 'Calabresa', ingredients: [1, 2, 3, 7], image: 'https://bzfd.it/2FgdiFL'},
	4: {id: 4, name: 'Portuguesa', ingredients: [1, 2, 4, 5, 6, 7], image: 'https://bit.ly/2TP7XMp'}
}

const promos = {
	1: {id: 1, name: 'Light', description: 'Se a pizza não tem bacon, ganha 10% de desconto.'},
	2: {id: 2, name: 'Dobro queijo', description: 'A cada 2 porções de queijo o cliente só paga 1. Se a pizza tiver 2 porções, o cliente pagará 1. Assim por diante'}
}

let orders = {}

// Basic configuration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(process.env.PORT || 8080)

// Business logic
const map_to_array = (map) => {
	let list = []
	Object.keys(map).forEach(key => list.push(map[key]))
	return list
}

const list_endpoints = (res) =>	res.send('Valid REST routes:\n/api/pedido\n/api/ingrediente\n/api/pizza\n/api/promocao')
const list_pizzas = (res) => res.json(map_to_array(pizzas))
const list_ingredients = (res) => res.json(map_to_array(ingredients))
const list_promos = (res) => res.json(map_to_array(promos))
const list_orders = (res) => res.json(map_to_array(orders))

const get_pizza = (id, res) => {
	if (!pizzas[id]) {
		return res.status(404).send('Id not found')
	}

	res.json(pizzas[id])
}

const list_ingredients_of_pizza = (id, res) => {
	if (!pizzas[id]) {
		return res.status(404).send('Id not found')
	}

	let i = []
	pizzas[id].ingredients.forEach(id => i.push(ingredients[id]))
	res.json(i)
}

const add_order = (id_pizza, extras, res) => {
	if (!pizzas[id_pizza]) {
		return res.status(400).send('Invalid id')
	}

	extras = extras ? JSON.parse(extras) : []
	let [last_id] = Object.keys(orders).slice(-1)
	let id = last_id ? parseInt(last_id) + 1 : 1
	let order = {id, id_pizza, extras, date: new Date().getTime()}
	orders[id] = order
	res.json(order)
}

// Routing
app.get('/', (req, res) => list_endpoints(res))
app.get('/api', (req, res) => list_endpoints(res))

app.get('/api/pizza', (req, res) => list_pizzas(res))
app.get('/api/pizza/:id_pizza', (req, res) => get_pizza(req.params.id_pizza, res))

app.get('/api/ingrediente', (req, res) => list_ingredients(res))
app.get('/api/ingrediente/de/:id_pizza', (req, res) => list_ingredients_of_pizza(req.params.id_pizza, res))

app.get('/api/promocao', (req, res) => list_promos(res))

app.get('/api/pedido', (req, res) => list_orders(res))
app.put('/api/pedido/:id_pizza', (req, res) => add_order(req.params.id_pizza, req.body.extras, res))
