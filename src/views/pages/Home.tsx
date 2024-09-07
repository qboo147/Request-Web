import withAuthorization from "@/lib/utils/withAuthorization";
const Home = () => {
  return <div className="px-2 py-4 md:px-4">Home</div>;
};
const allowedRoles = [""];

export default withAuthorization(Home, allowedRoles);
