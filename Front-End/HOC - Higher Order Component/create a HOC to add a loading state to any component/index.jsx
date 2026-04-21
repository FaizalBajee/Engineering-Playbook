import App from "./app"

function withLoader(component) {
    return function (props) {
        return (
            <>
                {loader ? <div>Loading...</div> : <component {...props} />}
            </>

        )
    }
}


const AppWithLoader = withLoader(App);


<AppWithLoader loader={true} />