using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace WpfApplication
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();            
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            MenuItem root = new MenuItem() { Title = "Menu", ItemIcon = "Image/server1.ico", Type =  NodeType.Server};
            MenuItem childItem1 = new MenuItem() { Title = "Child item #1", ItemIcon = "Image/server1.ico", Type = NodeType.Server };
            childItem1.Items.Add(new MenuItem() { Title = "Child item #1.1", ItemIcon = "Image/search.ico", Type = NodeType.Group });
            childItem1.Items.Add(new MenuItem() { Title = "Child item #1.2", ItemIcon = "Image/search.ico", Type = NodeType.Group });
            root.Items.Add(childItem1);
            root.Items.Add(new MenuItem() { Title = "Child item #2", ItemIcon = "Image/server1.ico", Type = NodeType.Server });
            root.Items.Add(new MenuItem() { Title = "Child item #3", ItemIcon = "Image/server1.ico", Type = NodeType.Server });
            root.Items.Add(new MenuItem() { Title = "Child item #4", ItemIcon = "Image/server1.ico", Type = NodeType.Server });
            trvMenu.Items.Add(root);
        }

        private void trvMenu_SelectedItemChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {

        }

        private void textBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("xx");
        }
    }
    public enum NodeType
    {
        Server = 1,
        Group = 2
    }
    public class MenuItem
    {
        public MenuItem()
        {
            this.Items = new ObservableCollection<MenuItem>();
        }
        public string Title { get; set; }
        public string ItemIcon { get; set; }
        public NodeType Type { get; set; }
        public ObservableCollection<MenuItem> Items { get; set; }
    }


}
