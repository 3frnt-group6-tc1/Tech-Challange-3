import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const HomeScreen = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getFirstName = (email) => {
    if (!email) return 'Usuário';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.colors.gradient}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>
              Olá, {getFirstName(user?.email)}!
            </Text>
            <Text style={styles.subtitle}>
              Como estão suas finanças hoje?
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getFirstName(user?.email).charAt(0)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
            Saldo Total
          </Text>
          <Text style={[styles.balance, { color: theme.colors.text }]}>
            R$ 2.540,80
          </Text>
          <Text style={[styles.balanceChange, { color: theme.colors.success }]}>
            +12.5% este mês
          </Text>
        </Card>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Receitas
            </Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.success }]}>
              R$ 3.200,00
            </Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Despesas
            </Text>
            <Text style={[styles.summaryAmount, { color: theme.colors.error }]}>
              R$ 659,20
            </Text>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Adicionar Receita"
            variant="success"
            style={styles.actionButton}
            onPress={() => {}}
          />
          
          <Button
            title="Adicionar Despesa"
            variant="danger"
            style={styles.actionButton}
            onPress={() => {}}
          />
        </View>

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Transações Recentes
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            <TransactionItem
              title="Salário"
              category="Trabalho"
              amount="+ R$ 3.200,00"
              date="Hoje"
              type="income"
              theme={theme}
            />
            <TransactionItem
              title="Supermercado"
              category="Alimentação"
              amount="- R$ 127,50"
              date="Ontem"
              type="expense"
              theme={theme}
            />
            <TransactionItem
              title="Combustível"
              category="Transporte"
              amount="- R$ 95,00"
              date="2 dias atrás"
              type="expense"
              theme={theme}
            />
          </View>
        </Card>
        </ScrollView>
      </View>
    </View>
  );
};

const TransactionItem = ({ title, category, amount, date, type, theme }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionLeft}>
      <View style={[
        styles.transactionIconContainer,
        { backgroundColor: type === 'income' ? theme.colors.success + '20' : theme.colors.error + '20' }
      ]}>
        <Text style={[
          styles.transactionIcon,
          { color: type === 'income' ? theme.colors.success : theme.colors.error }
        ]}>
          {type === 'income' ? '↗' : '↙'}
        </Text>
      </View>
      <View>
        <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.transactionCategory, { color: theme.colors.textSecondary }]}>
          {category} • {date}
        </Text>
      </View>
    </View>
    <Text style={[
      styles.transactionAmount, 
      { color: type === 'income' ? theme.colors.success : theme.colors.error }
    ]}>
      {amount}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
