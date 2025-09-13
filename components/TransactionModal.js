import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './Button';

const TransactionModal = ({ 
  visible, 
  onClose, 
  onSave, 
  type = 'income' 
}) => {
  const { theme } = useTheme();
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');

  const handleSave = () => {
    const value = parseFloat(formAmount.replace(',', '.'));
    if (!formTitle || isNaN(value)) {
      onClose();
      return;
    }
    
    const newTransaction = {
      title: formTitle,
      category: type === 'income' ? 'Receita' : 'Despesa',
      amount: value,
      type: type,
      date: 'Agora',
    };
    
    onSave(newTransaction);
    setFormTitle('');
    setFormAmount('');
    onClose();
  };

  const handleClose = () => {
    setFormTitle('');
    setFormAmount('');
    onClose();
  };

  const modalTitle = type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa';

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            {modalTitle}
          </Text>

          <TextInput
            placeholder="Título"
            value={formTitle}
            onChangeText={setFormTitle}
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholderTextColor={theme.colors.textSecondary}
          />
          
          <TextInput
            placeholder="Valor (ex: 100)"
            value={formAmount}
            onChangeText={setFormAmount}
            keyboardType="decimal-pad"
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholderTextColor={theme.colors.textSecondary}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              style={styles.cancelButton}
              onPress={handleClose}
            />
            <Button
              title="Salvar"
              variant={type === 'income' ? 'success' : 'danger'}
              style={styles.saveButton}
              onPress={handleSave}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 4,
  },
  saveButton: {
    flex: 1,
    marginLeft: 4,
  },
});

export default TransactionModal;
