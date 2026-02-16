import { LoadingOverlay } from '@mantine/core'

const PageLoader = () => {
  return (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
      loaderProps={{ size: 60, type: "dots" }}
    />
  );
};
export default PageLoader;
