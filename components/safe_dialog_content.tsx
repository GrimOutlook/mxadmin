import * as DialogPrimitive from '@rn-primitives/dialog';
import { DialogContent } from './ui/dialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

function SafeDialogContent({
  children,
  ...props
}: DialogPrimitive.ContentProps &
  React.RefAttributes<DialogPrimitive.ContentRef> & {
    portalHost?: string;
  }) {
  // Used to prevent the dialog content from extending outside of the user
  // accessible area. Couldn't find a way to just wrap it with `SafeAreaView`
  // and have it actually work.
  const insets = useSafeAreaInsets();
  // Used to prevent dialog content from extending too far.
  const { height, width } = Dimensions.get('window');

  return (
    <DialogContent
      style={{
        maxHeight: height - insets.top - insets.bottom - 40,
        maxWidth: width - insets.left - insets.right - 20,
        marginTop: insets.top + 20,
        marginBottom: insets.bottom + 20,
      }}
      {...props}>
      {children}
    </DialogContent>
  );
}

export { SafeDialogContent };
