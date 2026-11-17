import { Image, Pressable, Text, View } from 'react-native';
import { Check, Tag } from 'lucide-react-native';
import styles from '../styles';

export function ActionButton({ icon: Icon, label, onPress, variant = 'primary' }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.actionButton,
      variant === 'secondary' && styles.actionButtonSecondary,
      variant === 'danger' && styles.actionButtonDanger,
      pressed && styles.actionButtonPressed,
    ]}>
      {Icon && <Icon size={16} color={variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? '#B91C1C' : '#166534'} strokeWidth={2.3} />}
      <Text style={[styles.actionButtonText, variant === 'secondary' && styles.actionButtonSecondaryText, variant === 'danger' && styles.actionButtonDangerText]}>{label}</Text>
    </Pressable>
  );
}

export function SortChip({ label, selected, onPress }) {
  return <Pressable onPress={onPress} style={[styles.sortChip, selected && styles.sortChipSelected]}><Text style={[styles.sortChipText, selected && styles.sortChipTextSelected]}>{label}</Text></Pressable>;
}

export function ChoiceChip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.choiceChip, selected && styles.choiceChipSelected]}>
      {selected && <Check size={15} color="#FFFFFF" strokeWidth={3} />}
      <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ProductImage({ uri, style }) {
  if (!uri) {
    return <View style={[style, styles.imagePlaceholder]}><Tag size={24} color="#73A47D" strokeWidth={2} /><Text style={styles.imagePlaceholderText}>Sin imagen</Text></View>;
  }
  return <Image source={{ uri }} style={style} />;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}><Icon size={25} color="#73A47D" strokeWidth={2} /></View>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateText}>{description}</Text>
      {actionLabel && <ActionButton label={actionLabel} onPress={onAction} variant="secondary" />}
    </View>
  );
}
