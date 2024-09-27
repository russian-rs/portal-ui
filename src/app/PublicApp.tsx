import PublicRouter from "src/app/router/PublicRouter"

// @ts-ignore
const PublicApp = ({ match }) => {
    return (
        <>
            <PublicRouter match={match} />
        </>
    )
}

export default PublicApp
