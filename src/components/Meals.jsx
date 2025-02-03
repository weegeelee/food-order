import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";

const requestConfig = {}
export default function Meals() {
    const {
        data: loadMeals, 
        isLoading, 
        error,
    } = useHttp('http://localhost:3000/meals', requestConfig, [])

    if (isLoading) {
        return <p className="center">Fetching meals...</p>
    }

    if (error) {
        return <Error title="Failed to fetch meals" message={error} />
    }

    return (

        <ul id="meals">
            {loadMeals.map((meal) => 
            <MealItem key={meal.id} meal={meal} />
            )}
        </ul>
    );
}