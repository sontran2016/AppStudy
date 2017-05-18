using Microsoft.Practices.Prism.Commands;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading;
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
    /// Interaction logic for PingAsync.xaml
    /// </summary>
    public partial class PingAsync : Window
    {
        public ObservableCollection<ComputerModel> _Computers;
        private ComputerModel _ComputerEdit;

        public PingAsync()
        {
            InitializeComponent();

            lvIP.DataContext = this;
            _Computers = new ObservableCollection<ComputerModel>();
            _Computers.Add(new ComputerModel { IP = "192.168.1.64" });
            _Computers.Add(new ComputerModel { IP = "192.168.1.224" });
            lvIP.ItemsSource = _Computers;

            CommandBinding DeleteCmdBinding = new CommandBinding(ApplicationCommands.Delete, DeleteCmdExecuted);
            CommandBinding EditCmdBinding = new CommandBinding(ApplicationCommands.Properties, EditCmdExecuted);
            this.CommandBindings.Add(DeleteCmdBinding);
            this.CommandBindings.Add(EditCmdBinding);
        }
        private void btnAdd_Click(object sender, RoutedEventArgs e)
        {
            _Computers.Add(new ComputerModel { IP = txtIP.Text, Status = false });
            txtIP.Text = "";
        }

        private void btnUpdate_Click(object sender, RoutedEventArgs e)
        {
            if (txtIP.DataContext != null)
            {
                var biding = txtIP.GetBindingExpression(TextBox.TextProperty);
                biding.UpdateSource();
                txtIP.DataContext = null;
            }
        }
        void DeleteCmdExecuted(object target, ExecutedRoutedEventArgs e)
        {
            var item = e.Parameter as ComputerModel;
            _Computers.Remove(item);
        }
        void EditCmdExecuted(object target, ExecutedRoutedEventArgs e)
        {
            _ComputerEdit = e.Parameter as ComputerModel;
            txtIP.DataContext = _ComputerEdit;
        }

        private void btnPing_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (_Computers == null) return;
                int timeout = 5000;

                string data = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
                byte[] buffer = Encoding.ASCII.GetBytes(data);
                PingOptions options = new PingOptions(64, true);
                AutoResetEvent waiter = new AutoResetEvent(false);
                foreach (var item in _Computers)
                {
                    Ping pingSender = new Ping();
                    pingSender.PingCompleted += new PingCompletedEventHandler(PingCompletedCallback);
                    pingSender.SendAsync(item.IP, timeout, buffer, options, waiter);
                    //waiter.WaitOne();
                }
                //waiter.WaitOne();
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                if (((System.Runtime.InteropServices.ExternalException)ex.InnerException).ErrorCode == -2147467259)
                    msg = "Network is not connected";
                MessageBox.Show(msg,"Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        private void PingCompletedCallback(object sender, PingCompletedEventArgs e)
        {
            if (e.Cancelled)
            {
                //MessageBox.Show("Ping canceled.");
                //((AutoResetEvent)e.UserState).Set();
            }
            if (e.Error != null)
            {
                //MessageBox.Show("Ping failed: " + e.Error.ToString());
                //((AutoResetEvent)e.UserState).Set();
            }
            PingReply reply = e.Reply;
            DisplayReply(reply);

            //((AutoResetEvent)e.UserState).Set();
        }
        public void DisplayReply(PingReply reply)
        {
            if (reply == null || reply.Status == IPStatus.TimedOut) return;
            var item = _Computers.Single(x => x.IP == reply.Address.ToString());
            item.Status = reply.Status == IPStatus.Success;
            lvIP.Items.Refresh();
        }
    }
    public class ComputerModel
    {
        public string Name { get; set; }
        public string IP { get; set; }
        //public bool Status { get; set; }

        private bool _status;
        public bool Status
        {
            get { return this._status; }
            set
            {
                if (this._status != value)
                {
                    this._status = value;
                    this.NotifyPropertyChanged("Status");
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
    //public class DelegateCommand : ICommand
    //{
    //    public event EventHandler CanExecuteChanged;
    //    readonly Predicate<Object> _canExecute = null;
    //    readonly Action<Object> _executeAction = null;
    //    public DelegateCommand(Action<object> executeAction, Predicate<Object> canExecute)
    //    {
    //        _executeAction = executeAction;
    //        _canExecute = canExecute;
    //    }
    //    public DelegateCommand(Action<object> executeAction) : this(executeAction, null)
    //    {
    //        _executeAction = executeAction;
    //    }
    //    public void UpdateCanExecute()
    //    {
    //        if (CanExecuteChanged != null)
    //            CanExecuteChanged(this, new EventArgs());
    //    }
    //    public bool CanExecute(object parameter)
    //    {
    //        return _canExecute == null || _canExecute(parameter);
    //    }
    //    public void Execute(object parameter)
    //    {
    //        if (_executeAction != null)
    //            _executeAction(parameter);
    //        UpdateCanExecute();
    //    }
    //}
}
