using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO.Ports;

namespace Scale
{
    public partial class Form1 : Form
    {
        private delegate void ShowTextDelegate(TextBox obj, string txt);
        private SerialPort serialPort1;
        private SerialPort serialPort2;
        public Form1()
        {
            InitializeComponent();

            btnDisConnect.Enabled = false;
            btnSend.Enabled = false;
            btnDisConnect2.Enabled = false;
            btnSend2.Enabled = false;
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            serialPort1=new SerialPort(txtPort1.Text);
            serialPort2 = new SerialPort(txtPort2.Text);

            serialPort1.DataReceived += SerialPort1_DataReceived;
            serialPort1.ErrorReceived += SerialPort1_ErrorReceived;
            serialPort2.DataReceived += SerialPort2_DataReceived;
            serialPort2.ErrorReceived += SerialPort2_ErrorReceived;

            comboBox1.Items.AddRange(SerialPort.GetPortNames());
        }

        private void SerialPort2_ErrorReceived(object sender, SerialErrorReceivedEventArgs e)
        {
            txtReceive2.BeginInvoke(new ShowTextDelegate(ShowText), txtReceive2, "error");
        }

        private void SerialPort2_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            var port = sender as SerialPort;
            var txt = port.ReadLine();
            txtReceive2.BeginInvoke(new ShowTextDelegate(ShowText),txtReceive2,txt);
        }

        private void SerialPort1_ErrorReceived(object sender, SerialErrorReceivedEventArgs e)
        {
            txtReceive1.BeginInvoke(new ShowTextDelegate(ShowText), txtReceive1, "error");
        }

        private void SerialPort1_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            var port = sender as SerialPort;
            var txt = port.ReadLine();
            txtReceive1.BeginInvoke(new ShowTextDelegate(ShowText), txtReceive1, txt);
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            serialPort1.PortName = txtPort1.Text;
            serialPort1.Open();
            btnConnect.Enabled = !btnConnect.Enabled;
            btnDisConnect.Enabled = !btnConnect.Enabled;
            btnSend.Enabled = !btnConnect.Enabled;
        }

        private void btnDisConnect_Click(object sender, EventArgs e)
        {
            serialPort1.Close();
            btnConnect.Enabled = !btnConnect.Enabled;
            btnDisConnect.Enabled = !btnConnect.Enabled;
            btnSend.Enabled = !btnConnect.Enabled;
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
            var r = new Random();
            var m = Math.Round(r.NextDouble(), 2);
            serialPort1.WriteLine(""+m);
        }
        private void btnConnect2_Click(object sender, EventArgs e)
        {
            serialPort2.PortName = txtPort2.Text;
            serialPort2.Open();
            btnConnect2.Enabled = !btnConnect2.Enabled;
            btnDisConnect2.Enabled = !btnConnect2.Enabled;
            btnSend2.Enabled = !btnConnect2.Enabled;
        }

        private void btnDisConnect2_Click(object sender, EventArgs e)
        {
            serialPort2.Close();
            btnConnect2.Enabled = !btnConnect2.Enabled;
            btnDisConnect2.Enabled = !btnConnect2.Enabled;
            btnSend2.Enabled = !btnConnect2.Enabled;
        }

        private void btnSend2_Click(object sender, EventArgs e)
        {
            var r = new Random();
            var m = Math.Round(r.NextDouble(), 2);
            serialPort2.WriteLine("" + m);
        }

        private void ShowText(TextBox obj, string txt)
        {
            obj.Text = txt;
        }
    }
}
