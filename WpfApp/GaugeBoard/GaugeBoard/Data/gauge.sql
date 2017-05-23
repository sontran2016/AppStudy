CREATE TABLE [Settings](
	[Id] [integer] primary key AUTOINCREMENT NOT NULL,
	[Email] [varchar](50) NULL,
	[MaxTemperature] [numeric](18, 0) NOT NULL,
	[MaxHumidity] [numeric](18, 0) NOT NULL,
	[MaxDirty] [numeric](18, 0) NOT NULL,
	[IsWarning] [bit] NOT NULL,
	[WarningTime] [datetime] NULL,
	[LastUpdate] [datetime] NOT NULL
);
CREATE TABLE [Temperatures](
	[Id] [integer] primary key AUTOINCREMENT NOT NULL,
	[DateTime] [datetime] NOT NULL,
	[Value] [numeric](18, 0) NOT NULL	
);
CREATE TABLE [Types](
	[Id] [integer] primary key AUTOINCREMENT NOT NULL,
	[Name] [varchar](50) NOT NULL,
	[Unit] [varchar](50) NOT NULL
);
CREATE TABLE [Overloads](
	[Id] [integer] primary key AUTOINCREMENT NOT NULL,
	[TypeId] [integer] NOT NULL,
	[Value] [numeric](18, 0) NOT NULL,
	[DateTime] [datetime] NOT NULL,
	foreign key (TypeId) references [Types](Id)
);