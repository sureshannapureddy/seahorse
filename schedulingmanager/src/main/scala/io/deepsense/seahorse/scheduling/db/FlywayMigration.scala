/**
 * Copyright (c) 2016, CodiLime Inc.
 */

package io.deepsense.seahorse.scheduling.db

import org.flywaydb.core.Flyway

import io.deepsense.seahorse.scheduling.SchedulingManagerConfig

object FlywayMigration {

  private val db = SchedulingManagerConfig.database

  def run(): Unit = {
    val flyway = new Flyway
    flyway.setLocations("db.migration.schedulingmanager")
    flyway.setSchemas(db.schema, db.quartzSchema)
    flyway.setDataSource(SchedulingManagerConfig.config.getString("databaseSlick.db.url"), "", "")
    flyway.migrate()
  }
}