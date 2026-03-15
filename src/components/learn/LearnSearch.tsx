import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useTranslation } from '@/i18n';

interface LearnSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function LearnSearch({ value, onChange }: LearnSearchProps) {
  const { t } = useTranslation();

  return (
    <Input
      icon={<Search className="h-4 w-4" />}
      placeholder={t('learn.search.placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full [&_input]:h-11 [&_input]:py-3 [&_input]:px-4 [&_input]:text-sm"
    />
  );
}
