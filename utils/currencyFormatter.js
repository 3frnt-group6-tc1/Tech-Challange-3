export const parseCurrency = (formattedValue) => {
  if (!formattedValue) return '';
  
  const numericValue = formattedValue.replace(/\D/g, '');
  return (numericValue / 100).toFixed(2);
};

export const formatCurrencyInput = (value) => {
  if (!value) return '';
  
  const numericValue = value.replace(/\D/g, '');
  if (numericValue === '') return '';
  
  const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });
  
  return `R$ ${formattedValue}`;
};
