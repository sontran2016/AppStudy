using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace WpfApplication
{
    /// <summary>
    /// Interaction logic for Binding.xaml
    /// </summary>
    public partial class Binding : Window
    {
        public Binding()
        {
            InitializeComponent();
            this.DataContext = this;

            users.Add(new User() { Name = "John Doe" });
            users.Add(new User() { Name = "Jane Doe" });
            lbUsers.ItemsSource = users;

            users2.Add(new User() { Name = "John Doe" });
            users2.Add(new User() { Name = "Jane Doe" });
            lbUsers2.ItemsSource = users2;

            users3.Add(new User() { Name = "John Doe", Age = 11, Mail = "xx1"});
            users3.Add(new User() { Name = "Jane Doe", Age = 12, Mail = "xx2" });
            lvUsers.ItemsSource = users3;

            txtName.DataContext = users3.First();
        }
        private void btnUpdateSource_Click(object sender, RoutedEventArgs e)
        {
            var biding= txtWindowTitle.GetBindingExpression(TextBox.TextProperty);
            biding.UpdateSource();
        }

        private ObservableCollection<User> users = new ObservableCollection<User>();
        private ObservableCollection<User> users2 = new ObservableCollection<User>();
        private ObservableCollection<User> users3 = new ObservableCollection<User>();
        private void btnAddUser_Click(object sender, RoutedEventArgs e)
        {
            users.Add(new User() { Name = "New user" });
        }

        private void btnChangeUser_Click(object sender, RoutedEventArgs e)
        {
            if (lbUsers.SelectedItem != null)
            {
                (lbUsers.SelectedItem as User).Name = "Random Name";
                //lbUsers.Items.Refresh();  //can use if not using INotifyPropertyChanged
            }
        }

        private void btnDeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (lbUsers.SelectedItem != null)
                users.Remove(lbUsers.SelectedItem as User);
        }

        private void btnAddUser2_Click(object sender, RoutedEventArgs e)
        {
            users2.Add(new User() { Name = "New user" });
        }

        private void btnChangeUser2_Click(object sender, RoutedEventArgs e)
        {
            if (lbUsers2.SelectedItem != null)
            {
                (lbUsers2.SelectedItem as User).Name = "Random Name";
            }
        }

        private void btnDeleteUser2_Click(object sender, RoutedEventArgs e)
        {
            if (lbUsers2.SelectedItem != null)
                users2.Remove(lbUsers2.SelectedItem as User);
        }

        private void btnAddUser3_Click(object sender, RoutedEventArgs e)
        {
            users3.Add(new User() { Name = "New user", Age = 0, Mail = "xx"});
        }

        private void btnChangeUser3_Click(object sender, RoutedEventArgs e)
        {
            if (lvUsers.SelectedItem != null)
            {
                (lvUsers.SelectedItem as User).Name = "Random Name";
            }
        }

        private void btnDeleteUser3_Click(object sender, RoutedEventArgs e)
        {
            if (lvUsers.SelectedItem != null)
                users3.Remove(lvUsers.SelectedItem as User);
        }

        private void btnOK_Click(object sender, RoutedEventArgs e)
        {
            var biding = txtName.GetBindingExpression(TextBox.TextProperty);
            biding.UpdateSource();
        }
        public class User : INotifyPropertyChanged
        {
            public string Mail { get; set; }
            public int Age { get; set; }

            private string name;
            public string Name
            {
                get { return this.name; }
                set
                {
                    if (this.name != value)
                    {
                        this.name = value;
                        this.NotifyPropertyChanged("Name");
                    }
                }
            }

            public event PropertyChangedEventHandler PropertyChanged;

            public void NotifyPropertyChanged(string propName)
            {
                if (this.PropertyChanged != null)
                    this.PropertyChanged(this, new PropertyChangedEventArgs(propName));
            }
        }

    }

}
