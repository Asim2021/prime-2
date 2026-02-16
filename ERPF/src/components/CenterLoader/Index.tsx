import { Loader, MantineSize, rem } from "@mantine/core";
import classes from "./classes.module.css";

const CenterLoader = ({ size = 'md' }: { size?: number | MantineSize }) => {
  return (
    <div className={classes.loaderContainer}>
      <Loader className="text-primary-600" size={rem(size)} />
    </div>
  );
};
export default CenterLoader;
