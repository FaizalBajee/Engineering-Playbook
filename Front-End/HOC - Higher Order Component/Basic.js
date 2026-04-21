
// A higher-order function (HOF) 
// is a function that takes another function as an argument or returns a function

// Example 1 — Function takes another function
function sayHi(name, formatter) {
    return formatter(name)
}

function formatter(name) {
    return `Hi ${name}`
}

console.log(sayHi("Faizal", formatter))

// Example 2 — Function returns another function

function createMultiplier(multiplier) {
    return function (num) {
        return num ? num * multiplier : "Please enter a number"
    }
}
const double = createMultiplier(2)

console.log(double(5))

// Centralized Error Handling in Express APIs

function asyncHandler(fn) {
    return function (req, res, next) {
        try {
            fn(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

app.get("/user", asyncHandler(async (req, res) => { 
    const user = await User.findById(req.params.id) 
    res.json(user)
}))

//create a HOC to add a loading state to any component?

function withLoader(component){
    return function (props){
        
    }
}