/**
 * Copyright (c) 2015, CodiLime, Inc.
 *
 * Owner: Witold Jedrzejewski
 */

package io.deepsense.deeplang.dhierarchy

import scala.reflect.runtime.{universe => ru}

/**
 * Represents Class in DHierarchy graph.
 */
private[dhierarchy] class ClassNode(protected override val typeInfo: Class[_]) extends Node {

  private[dhierarchy] override def info: TypeInfo = {
    val parentName = if (parent.isDefined) Some(parent.get.displayName) else None
    ClassInfo(displayName, parentName, supertraits.values.map(_.displayName).toList)
  }

  override def toString: String = s"DClass($fullName)"
}

private[dhierarchy] object ClassNode {
  def apply(typeInfo: Class[_]): ClassNode = {
    if (DHierarchy.isAbstract(typeInfo))
      new ClassNode(typeInfo)
    else
      new ConcreteClassNode(typeInfo)
  }
}
