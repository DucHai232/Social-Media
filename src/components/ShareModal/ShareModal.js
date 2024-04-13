import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import PostShare from "../PostShare/PostShare";

function ShareModal({ modalOpened, setModalOpened }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={modalOpened}
        size="55%"
        onClose={() => setModalOpened(false)}
        title="Authentication"
      >
        <PostShare />
      </Modal>
    </>
  );
}

export default ShareModal;
