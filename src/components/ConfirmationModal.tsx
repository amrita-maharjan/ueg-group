import { Button, Flex, Modal, Stack, Text } from "@mantine/core";

type Props = {
  opened: boolean;
  onOkayClick: () => void;
  close: () => void;
};

export const ConfirmationModal = (props: Props) => {
  const { opened, close, onOkayClick } = props;
  return (
    <Modal opened={opened} onClose={close}>
      <Stack>
        <Text fw={"500"}>Confirm Voucher Generation</Text>
        <Text>
          Are you sure you want to generate voucher for the selected
          participants?
        </Text>
        <Flex gap={"lg"} justify={"flex-end"}>
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={() => {
              onOkayClick();
            }}
          >
            Ok
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};
